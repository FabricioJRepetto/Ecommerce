require("dotenv").config();
const {
  CLOUDINARY_CLOUD,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  MELI_SEARCH_URL,
  MELI_SEARCH_URL_ADDONS,
  MELI_PRODUCT_ID,
} = process.env;
const Product = require("../models/product");
const cloudinary = require("cloudinary").v2;
const axios = require("axios");
const { meliSearchParser } = require("../utils/meliParser");
const { rawIdProductGetter } = require("../utils/rawIdProductGetter");

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

const getAll = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

const getByQuery = async (req, res, next) => {
  try {
    let searchQuery = "";
    Object.entries(req.query).forEach(([key, value]) => {
      searchQuery += "&" + key + "=" + value;
    });
    console.log(req.query);

    const L = "50";
    const meli = `https://api.mercadolibre.com/sites/MLA/search?&official_store=all&limit=${L}${searchQuery}`;

    const { data } = await axios(meli);

    const allowedFilters = [
      "BRAND",
      "discount",
      "shipping_cost",
      "price",
      "category",
    ];
    const filters = data.available_filters.filter((e) =>
      allowedFilters.includes(e.id)
    );

    const applied = data.filters.filter(
      (e) => e.id !== "official_store" && e.id !== "category"
    );

    const breadCrumbs = data.filters.find((e) => e.id === "category")?.values[0]
      .path_from_root;

    const resultsMeli = meliSearchParser(data.results);

    let resultsDB = await Product.find();

    if (req.query.q) {
      let aux = new RegExp(req.query.q.replace(" ", "|"), "gi");
      resultsDB = await Product.find({
        $or: [{ name: { $in: [aux] } }, { brand: { $in: [aux] } }],
      });
    }

    const filterDBResults = async (filters, products) => {
      let response = [...products];
      if (filters.BRAND) {
        response = response.filter(
          (e) => e.brand.toLowerCase() === filters.BRAND.toLowerCase()
        );
      }
      if (filters.price) {
        let [min, max] = filters.price.split("-");
        min === "*" ? min === 0 : (min = parseInt(min));
        max = parseInt(max);

        response = response.filter((e) => e.price >= min && e.price <= max);
      }
      if (filters.category) {
        response = response.filter((e) =>
          e?.path_from_root.includes(filters.category)
        );
      }
      if (filters.free_shipping) {
        response = response.filter((e) => e.free_shipping);
      }
      if (filters.discount) {
        let [filterDisc] = filters.discount.split("-");
        response = response.filter((e) => e.discount >= parseInt(filterDisc));
      }
      return response;
    };
    let auxFilters = applied.brand
      ? { ...req.query, BRAND: applied.brand.values[0].name }
      : req.query;
    resultsDB = await filterDBResults(auxFilters, resultsDB);

    return res.json({
      db: resultsDB,
      meli: resultsMeli,
      filters,
      applied,
      breadCrumbs,
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const product = await rawIdProductGetter(id);
    return res.json(product);
  } catch (error) {
    next(error);
  }
};

const stock = async (req, res, next) => {
  try {
    let list = req.body;

    for (const prod of list) {
      let { id, amount } = prod;

      if (!/MLA/g.test(id)) {
        await Product.findOneAndUpdate(
          { _id: id },
          {
            $inc: {
              available_quantity: -amount,
            },
          }
        );
      }
    }
    return res.json("stock updated");
  } catch (error) {
    next(error);
  }
};

const getPromos = async (req, res, next) => {
  try {
    const categories = [
      "MLA1039",
      "MLA1051",
      "MLA1648",
      "MLA1144",
      "MLA1000",
      "MLA3025",
      "MLA1168",
      "MLA1182",
    ];
    let promises = [];
    let results = [];

    categories.forEach((c) => {
      promises.push(
        axios(
          `http://api.mercadolibre.com/sites/MLA/search?&official_store=all&promotion_type=deal_of_the_day&category=${c}`
        )
      );
    });

    const promiseAll = await Promise.all(promises);
    promiseAll.forEach((r) => {
      results = results.concat(r.data.results);
    });
    results = meliSearchParser(results);

    return res.json(results);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getByQuery,
  getById,
  stock,
  getPromos,
};

import { createSlice } from "@reduxjs/toolkit";

const filterFunction = (state, source, type, value, firstIteration) => {
  let productsToFilter;

  if (firstIteration) {
    productsToFilter = state[source];
  } else {
    state.productsFiltered.length === 0
      ? (productsToFilter = state[source])
      : (productsToFilter = state.productsFiltered);
  }

  if (type === "price") {
    let minPrice = value.split("-")[0];
    let maxPrice = value.split("-")[1];

    state.productsFiltered = productsToFilter.filter(
      (product) => product[type] >= minPrice && product[type] <= maxPrice
    );
  } else if (type === "brand") {
    state.productsFiltered = productsToFilter.filter((product) =>
      state.productsOwnFiltersApplied.brand.includes(
        product.brand.toUpperCase()
      )
    );
  } else {
    state.productsFiltered = productsToFilter.filter(
      (product) => product[type] === value
    );
  }
};

const deleteFunction = (state, source, _id) => {
  state[source] = state[source].filter((prod) => prod._id !== _id);
  if (!state[source].length) state[source] = [null];
};

const discountFunction = (state, source, add, prodId, type, number) => {
  state[source] = state[source].map((prod) => {
    if (prod._id === prodId) {
      if (add) {
        let discount, sale_price;

        if (type === "percent") {
          discount = parseInt(number);
          sale_price = prod.price - (parseInt(number) * prod.price) / 100;
        } else {
          discount = (parseInt(number) * 100) / prod.price;
          sale_price = prod.price - parseInt(number);
        }

        return {
          ...prod,
          sale_price: Math.round(sale_price),
          on_sale: true,
          discount: Math.round(discount),
        };
      } else {
        return {
          ...prod,
          on_sale: false,
          discount: 0,
        };
      }
    } else {
      return prod;
    }
  });
};

export const productsSlice = createSlice({
  name: "products",
  initialState: {
    productsOwn: [],
    productsRandom: [],
    productsFound: [],
    productsFilters: [],
    productsAppliedFilters: [],
    breadCrumbs: [],
    searchQuerys: {},
    productsOwnFiltersApplied: {},
    productsFiltered: [],
    productDetails: {},
    idProductToEdit: null,
  },
  reducers: {
    loadProductsOwn: (state, action) => {
      state.productsOwn = action.payload;
    },
    loadProductsFound: (state, action) => {
      state.productsFound = action.payload;
    },
    loadFilters: (state, action) => {
      state.productsFilters = action.payload;
    },
    loadApplied: (state, action) => {
      state.productsAppliedFilters = action.payload;
    },
    loadQuerys: (state, action) => {
      state.searchQuerys = action.payload;
    },
    loadBreadCrumbs: (state, action) => {
      state.breadCrumbs = action.payload;
    },

    deleteProductFromState: (state, action) => {
      deleteFunction(state, "productsOwn", action.payload);

      if (state.productsFiltered.length && state.productsFiltered[0] !== null) {
        deleteFunction(state, "productsFiltered", action.payload);
      }
      if (state.productsFound.length && state.productsFound[0] !== null) {
        deleteFunction(state, "productsFound", action.payload);
      }
    },

    applyDiscount: (state, action) => {
      const { add, prodId, type, number } = action.payload;

      discountFunction(state, "productsOwn", add, prodId, type, number);

      if (state.productsFiltered.length && state.productsFiltered[0] !== null) {
        discountFunction(state, "productsFiltered", add, prodId, type, number);
      }
      if (state.productsFound.length && state.productsFound[0] !== null) {
        discountFunction(state, "productsFound", add, prodId, type, number);
      }
    },

    filterProducts: (state, action) => {
      /* action.payload = {
                source: "productsOwn" || "productsFound" || "productsRandom",
                type:      'brand'      || 'free_shipping' ||     'price',
                value [STRING, BOOLEAN] ||     BOOLEAN     || STRING => min-max || null
             } */
      const { source, type, value } = action.payload;
      /* productsOwnFiltersApplied = {
                brand: [STRING],
                free_shipping: BOOLEAN,
                price: STRING => min-max
             } */

      if (value === null || value === false) {
        delete state.productsOwnFiltersApplied[type];
      } else {
        if (type === "brand") {
          if (value[1]) {
            state.productsOwnFiltersApplied = {
              ...state.productsOwnFiltersApplied,
              brand: state.productsOwnFiltersApplied.brand
                ? [
                    ...state.productsOwnFiltersApplied.brand,
                    value[0].toUpperCase(),
                  ]
                : [value[0].toUpperCase()],
            };
          } else {
            state.productsOwnFiltersApplied = {
              ...state.productsOwnFiltersApplied,
              brand: state.productsOwnFiltersApplied.brand.filter(
                (brand) => brand.toUpperCase() !== value[0].toUpperCase()
              ),
            };
            if (state.productsOwnFiltersApplied.brand.length === 0)
              delete state.productsOwnFiltersApplied.brand;
          }
        } else {
          state.productsOwnFiltersApplied = {
            ...state.productsOwnFiltersApplied,
            [type]: value,
          };
        }
      }

      if (Object.keys(state.productsOwnFiltersApplied).length === 0) {
        state.productsFiltered = [];
      } else {
        let firstIteration = true;
        for (const filterApplied in state.productsOwnFiltersApplied) {
          filterFunction(
            state,
            source,
            filterApplied,
            state.productsOwnFiltersApplied[filterApplied],
            firstIteration
          );
          firstIteration = false;
        }
        if (state.productsFiltered.length === 0)
          state.productsFiltered = [null];
      }
    },

    searchProducts: (state, action) => {
      state.productsFound = state.productsOwn.filter((prod) =>
        prod.name.toUpperCase().includes(action.payload.toUpperCase())
      );
      if (state.productsFound.length === 0) state.productsFound = [null];
    },

    orderProducts: (state, action) => {
      /* action.payload = {
                      source: "productsOwn" || "productsFound" || "productsRandom",
                      order: "asc" || "desc"
                   } */
      let productsToOrder;
      state.productsFiltered.length === 0
        ? (productsToOrder = state[action.payload.source])
        : (productsToOrder = state.productsFiltered);

      state[productsToOrder] = state[productsToOrder].sort((a, b) => {
        if (action.payload.order === "asc") {
          return a.price - b.price;
        } else {
          return b.price - a.price;
        }
      });
    },

    loadProductDetails: (state, action) => {
      state.productDetails = action.payload;
    },
    loadIdProductToEdit: (state, action) => {
      state.idProductToEdit = action.payload;
    },
  },
});

export const {
  loadProductsOwn,
  loadProductsFound,
  loadFilters,
  loadQuerys,
  loadApplied,
  loadBreadCrumbs,
  deleteProductFromState,
  applyDiscount,
  filterProducts,
  searchProducts,
  orderProducts,
  loadProductDetails,
  loadIdProductToEdit,
} = productsSlice.actions;

export default productsSlice.reducer;

/*
!results search:
https://api.mercadolibre.com/sites/MLA/
         search?q=${BUSQUEDA}
         &category=MLA454379 //!perifericos pc
         &official_store=all
         &has_pictures=yes
         &limit=${LIMITE}
         &discount=[5,10...30]-100
         &shipping_cost=free
         &promotion_type=deal_of_the_day

  {
    "id": "MLA1039",
    "name": "Cámaras y Accesorios"
  },
  {
    "id": "MLA1051",
    "name": "Celulares y Teléfonos"
  },
  {
    "id": "MLA1648",
    "name": "Computación"
  },
  {
    "id": "MLA1144",
    "name": "Consolas y Videojuegos"
  },
  {
    "id": "MLA1000",
    "name": "Electrónica, Audio y Video"
  },

{
   results: [
      {
         id: "MLA1",
         title: STRING,
         price: NUMBER, //! FILTER
         prices: [
            {
               type: standard,
               amount: NUMBER
            },
            {
               type: promotion,
               amount: NUMBER
            }
         ]
         thumbnail: STRING (link jpg),
         thumbnail_id: STRING,
         shipping: {
            free_shipping: BOOLEAN //! FILTER
         }
         attributes: [
            {
               name: "Marca", //! FILTER
               id: "BRAND",
               value_name: STRING
            }
         ],
         original_price: NUMBER, (puede venir null) //! FILTER?
         catalog_product_id: "MLA1"
      }
   ],
}

https://api.mercadolibre.com/products/${catalog_product_id}

{
   id: "MLA1",
   name: STRING,
   buy_box_winner: {
      price: NUMBER
   }
   pictures: [
      {
         url: STRING (link jpg)
      }, {}, {}
   ],
   main_features: [
      {
         text: STRING
      }, {}, {}
   ],
   attributes: [
      {
         id: BRAND,
         name: Marca,
         value_name: STRING
      },
      {
         id: MODEL,
         name: Modelo,
         value_name: STRING
      },
      {
         id: STRING,
         name: STRING,
         value_name: STRING
      }
   ],
   short_description: {
      content: STRING
   }
}


*/

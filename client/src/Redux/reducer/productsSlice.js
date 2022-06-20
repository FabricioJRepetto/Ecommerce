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
      state.filtersApplied.brand.includes(product.brand)
    );
  } else {
    state.productsFiltered = productsToFilter.filter(
      (product) => product[type] === value
    );
  }
};

export const productsSlice = createSlice({
  name: "products",
  initialState: {
    productsOwn: [],
    productsRandom: [],
    productsFound: [],
    filtersApplied: {},
    productsFiltered: [],
    productDetails: {},
  },
  reducers: {
    loadProductsFound: (state, action) => {
      state.productsFound = action.payload;
    },

    filterProducts: (state, action) => {
      /* action.payload = {
          source: "productsOwn" || "productsFound" || "productsRandom",
          type:      'brand'      || 'free_shipping' ||     'price',
          value [STRING, BOOLEAN] ||     BOOLEAN     || STRING => min-max || null
       } */
      const { source, type, value } = action.payload;
      /* filtersApplied = {
          brand: [STRING],
          free_shipping: BOOLEAN,
          price: STRING => min-max
       } */

      if (value === null || value === false) {
        delete state.filtersApplied[type];
      } else {
        if (type === "brand") {
          if (value[1]) {
            state.filtersApplied = {
              ...state.filtersApplied,
              brand: state.filtersApplied.brand
                ? [...state.filtersApplied.brand, value[0]]
                : [value[0]],
            };
          } else {
            state.filtersApplied = {
              ...state.filtersApplied,
              brand: state.filtersApplied.brand.filter(
                (brand) => brand !== value[0]
              ),
            };
            if (state.filtersApplied.brand.length === 0)
              delete state.filtersApplied.brand;
          }
        } else {
          state.filtersApplied = {
            ...state.filtersApplied,
            [type]: value,
          };
        }
      }

      if (Object.keys(state.filtersApplied).length === 0) {
        state.productsFiltered = [];
      } else {
        let firstIteration = true;
        for (const filterApplied in state.filtersApplied) {
          filterFunction(
            state,
            source,
            filterApplied,
            state.filtersApplied[filterApplied],
            firstIteration
          );
          firstIteration = false;
        }
      }
      //   if (!state.productsFiltered) state.productsFiltered = [null];
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
  },
});

export const {
  loadProductsFound,
  filterProducts,
  orderProducts,
  loadProductDetails,
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

import { createSlice } from "@reduxjs/toolkit";

const filterFunction = (state, source, type, value, firstRemove) => {
  let productsToFilter;

  if (firstRemove) {
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
    filtersApplied: [],
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
          type: 'brand' || 'free_shipping' || 'price',
          value: STRING || BOOLEAN || MIN-MAX || null
       } */
      const { source, type, value } = action.payload;

      /* filtersApplied = [
            {
               type: 'brand' || 'free_shipping' || 'price',
               value: STRING || BOOLEAN || MIN-MAX
            }, {}
        ] */
      if (value === null) {
        state.filtersApplied = state.filtersApplied.filter(
          (filterApplied) => filterApplied.type !== type
        );
        if (state.filtersApplied.length === 0) {
          state.productsFiltered = [];
        } else {
          let firstRemove = true;
          for (const filterApplied of state.filtersApplied) {
            console.log(filterApplied.type);
            console.log(filterApplied.value);
            filterFunction(
              state,
              source,
              filterApplied.type,
              filterApplied.value,
              firstRemove
            );
            firstRemove = false;
          }
        }
      } else {
        state.filtersApplied = [...state.filtersApplied, { type, value }];

        filterFunction(state, source, type, value);
      }
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

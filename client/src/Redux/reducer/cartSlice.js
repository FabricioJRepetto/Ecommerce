import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    main: [],
    total: 0,
    whishlist: [],
  },
  reducers: {
    loadProducts: (state, action) => {
      state.main = action.payload;
    },
    cartTotal: (state, action) => {
      state.total = action.payload;
    },
    addCart: (state, action) => {
        state.main = [...state.main, action.payload];
    },
    loadWhishlist: (state, action) => {
        state.whishlist = action.payload
    },
  },
});

export const { loadProducts, cartTotal, addCart, loadWhishlist } = cartSlice.actions;

export default cartSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    main: [],
    onCart: [],
    total: 0,
    whishlist: [],
  },
  reducers: {
    loadProducts: (state, action) => {
      state.main = action.payload;
    },
    loadCart: (state, action) => {
        state.onCart = action.payload
    },
    cartTotal: (state, action) => {
      state.total = action.payload;
    },
    addCart: (state, action) => {
        state.onCart = [...state.onCart, action.payload];
    },
    loadWhishlist: (state, action) => {
        state.whishlist = action.payload
    },
    resetCartSlice: (state, action) => {
        state.main = [];
        state.onCart = [];
        state.whishlist = [];
        state.total = 0;
    },
  },
});

export const { loadProducts, cartTotal, addCart, loadCart, loadWhishlist, resetCartSlice } = cartSlice.actions;

export default cartSlice.reducer;

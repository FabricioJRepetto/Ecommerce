import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    main: [],
    total: 0,
  },
  reducers: {
    loadProducts: (state, action) => {
      state.main = action.payload;
    },
    cartTotal: (state, action) => {
      state.total = action.payload;
    },    
  },
});

export const { loadProducts, cartTotal } = cartSlice.actions;

export default cartSlice.reducer;

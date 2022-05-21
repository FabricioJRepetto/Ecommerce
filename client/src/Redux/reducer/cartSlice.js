import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    main: [],
  },
  reducers: {
    loadProducts: (state, action) => {
      state.main = action.payload;
    },
  },
});

export const { loadProducts } = cartSlice.actions;

export default cartSlice.reducer;

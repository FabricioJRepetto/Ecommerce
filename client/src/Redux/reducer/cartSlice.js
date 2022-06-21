import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    main: 0, //: array si queremos mostrar en cart en un modal
    total: 0,
  },
  reducers: {
    loadProducts: (state, action) => {
      state.main = action.payload;
    },
    cartTotal: (state, action) => {
      state.total = action.payload;
    },
    mainPlus: (state, action) => {
      state.main += 1;
    },
    mainMinus: (state, action) => {
      state.main -= 1;
    },
  },
});

export const { loadProducts, cartTotal, mainPlus, mainMinus } =
  cartSlice.actions;

export default cartSlice.reducer;

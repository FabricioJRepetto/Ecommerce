import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../reducer/cartSlice.js";
import productsReducer from "../reducer/productsSlice.js";

export default configureStore({
  reducer: {
    cartReducer: cartReducer,
    productsReducer: productsReducer,
  },
});

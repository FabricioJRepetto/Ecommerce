import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../reducer/cartSlice.js";
import extraSlice from "../reducer/extraSlice.js";
import notificationSlice from "../reducer/notificationSlice.js";
import productsReducer from "../reducer/productsSlice.js";
import sessionReducer from "../reducer/sessionSlice.js";

export default configureStore({
    reducer: {
        cartReducer: cartReducer,
        productsReducer: productsReducer,
        sessionReducer: sessionReducer,
        notificationSlice,
        extraSlice
    },
});

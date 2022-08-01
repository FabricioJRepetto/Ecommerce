import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
    name: "cart",
    initialState: {
        onCart: [],
        total: 0,
        wishlist: [],
    },
    reducers: {
        loadCart: (state, action) => {
            state.onCart = action.payload;
        },
        cartTotal: (state, action) => {
            state.total = action.payload;
        },
        addCart: (state, action) => {
            state.onCart = [...state.onCart, action.payload];
        },
        loadWishlist: (state, action) => {
            state.wishlist = action.payload;
        },
        resetCartSlice: (state, action) => {
            state.main = [];
            state.onCart = [];
            state.wishlist = [];
            state.total = 0;
        },
    },
});

export const {
    cartTotal,
    addCart,
    loadCart,
    loadWishlist,
    resetCartSlice,
} = cartSlice.actions;

export default cartSlice.reducer;

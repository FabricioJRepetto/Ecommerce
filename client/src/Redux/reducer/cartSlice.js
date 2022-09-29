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
            let flag = state.total.find(e => e.id === action.payload.id)
            if (flag) {
                let aux = state.total.filter(e => e.id !== action.payload.id);
                aux.push(action.payload)
                state.total = aux;
            } else {
                state.total = [...state.total, action.payload];
            }
        },
        fullCartTotal: (state, action) => {
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
    fullCartTotal,
    addCart,
    loadCart,
    loadWishlist,
    resetCartSlice
} = cartSlice.actions;

export default cartSlice.reducer;

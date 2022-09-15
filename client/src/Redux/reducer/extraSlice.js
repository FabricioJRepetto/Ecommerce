import { createSlice } from "@reduxjs/toolkit";

export const extraSlice = createSlice({
    name: "extra",
    initialState: {
        carouselIndex: 0,
    },
    reducers: {
        updateCarouselIndex: (state, action) => {
            state.carouselIndex = action.payload;
        },
        resetCarouselIndex: (state) => {
            state.carouselIndex = 0;
        },
    },
});

export const {
    updateCarouselIndex,
    resetCarouselIndex
} = extraSlice.actions;

export default extraSlice.reducer;
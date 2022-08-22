import { createSlice } from "@reduxjs/toolkit";

export const notificationSlice = createSlice({
    name: "cart",
    initialState: {
        main: [],
    },
    reducers: {
        sendNotif: (state, action) => {
            state.main = [...state.main, { ...action.payload, id: state.main.length }];
        },
        close: (state, action) => {
            let aux = [...state.main];
            aux.map(e => (
                e.id === action.payload && (e.status = 'close')
            ));
            state.main = aux;
        },
    },
});

export const { sendNotif, close } = notificationSlice.actions;

export default notificationSlice.reducer;
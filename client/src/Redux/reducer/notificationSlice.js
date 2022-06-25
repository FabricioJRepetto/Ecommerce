import { createSlice } from "@reduxjs/toolkit";

export const notificationSlice = createSlice({
  name: "cart",
  initialState: {
    main: { 
        message: '',
        type: '',
         url: ''
    },
    open: false,
  },
  reducers: {
    sendNotif: (state, action) => {
      state.main = action.payload;
      state.open = true;
    },
    close: (state, action) => {
        state.open = false;
        state.main = { 
            message: '',
            type: '',
            url: ''
        };
    },
  },
});

export const { sendNotif, close } = notificationSlice.actions;

export default notificationSlice.reducer;
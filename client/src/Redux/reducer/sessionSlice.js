import { createSlice } from "@reduxjs/toolkit";

export const sessionSlice = createSlice({
  name: "session",
  initialState: {
    email: "",
    token: "",
    id: "",
  },
  reducers: {
    loadToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const { loadToken } = sessionSlice.actions;

export default sessionSlice.reducer;

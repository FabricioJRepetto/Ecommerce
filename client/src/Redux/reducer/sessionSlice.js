import { createSlice } from "@reduxjs/toolkit";

export const sessionSlice = createSlice({
  name: "session",
  initialState: {
    email: "",
    token: "",
    id: "",
  },
  reducers: {
    loadEmail: (state, action) => {
      state.email = action.payload;
    },
    loadUsername: (state, action) => {
      state.username = action.payload;
    },
    loadToken: (state, action) => {
      state.token = action.payload;
    },
    loadId: (state, action) => {
      state.id = action.payload;
    },
  },
});

export const { loadEmail, loadToken, loadId, loadUsername } =
  sessionSlice.actions;

export default sessionSlice.reducer;

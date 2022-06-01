import { createSlice } from "@reduxjs/toolkit";

export const sessionSlice = createSlice({
  name: "session",
  initialState: {
    username: null,
    token: null,
    id: null,
  },
  reducers: {
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

export const { loadUsername, loadToken, loadId } = sessionSlice.actions;

export default sessionSlice.reducer;

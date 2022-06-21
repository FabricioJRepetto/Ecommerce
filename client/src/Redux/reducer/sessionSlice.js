import { createSlice } from "@reduxjs/toolkit";

export const sessionSlice = createSlice({
  name: "session",
  initialState: {
    username: null,
    avatar: null,
    email: null,
    session: false,
    id: null,
  },
  reducers: {
    loadUsername: (state, action) => {
      state.username = action.payload;
    },
    sessionActive: (state, action) => {
      state.session = action.payload;
    },
    loadId: (state, action) => {
      state.id = action.payload;
    },
    loadAvatar: (state, action) => {
      state.avatar = action.payload;
    },
    loadEmail: (state, action) => {
      state.email = action.payload;
    },
  },
});

export const { loadUsername, sessionActive, loadId, loadAvatar, loadEmail } = sessionSlice.actions;

export default sessionSlice.reducer;

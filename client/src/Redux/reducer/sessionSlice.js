import { createSlice } from "@reduxjs/toolkit";

export const sessionSlice = createSlice({
  name: "session",
  initialState: {
    username: null,
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
  },
});

export const { loadUsername, sessionActive, loadId } = sessionSlice.actions;

export default sessionSlice.reducer;

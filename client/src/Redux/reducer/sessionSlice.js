import { createSlice } from "@reduxjs/toolkit";

export const sessionSlice = createSlice({
    name: "session",
    initialState: {
        username: null,
        full_name: {
            first: '',
            last: ''
        },
        avatar: null,
        email: null,
        session: false,
        id: null,
        role: null,
        isGoogleUser: null,
        allUsersData: [],
        filtersApplied: {},
        usersFilteredData: [],
    },
    reducers: {
        loadUsername: (state, action) => {
            state.username = action.payload;
        },
        loadFullName: (state, action) => {
            state.full_name = action.payload;
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
        loadRole: (state, action) => {
            state.role = action.payload;
        },
        loadGoogleUser: (state, action) => {
            state.isGoogleUser = action.payload;
        },
        adminLoadUsers: (state, action) => {
            state.allUsersData = action.payload;
        },
        adminDeleteUser: (state, action) => {
            console.log("entra", action.payload);
            state.allUsersData = state.allUsersData.map((user) => {
                if (user._id === action.payload) return { ...user, role: "deleted" };
                return user;
            });
        },
        adminPromoteUser: (state, action) => {
            state.allUsersData = state.allUsersData.map((user) => {
                if (user._id === action.payload) return { ...user, role: "admin" };
                return user;
            });
        },
        adminFilterUsers: (state, action) => {
            if (action.payload) {
                state.usersFilteredData = state.allUsersData.filter((user) =>
                    user.name.toUpperCase().includes(action.payload.toUpperCase())
                );
                if (state.usersFilteredData.length === 0)
                    state.usersFilteredData = [null];
            } else {
                state.usersFilteredData = [];
            }
            /* filtersApplied = {
              googleAccount: BOOLEAN,
              verifiedEmail: BOOLEAN,
              role: STRING,
            }; */
        },
    },
});

export const {
    loadUsername,
    loadFullName,
    sessionActive,
    loadId,
    loadAvatar,
    loadEmail,
    loadRole,
    loadGoogleUser,
    adminLoadUsers,
    adminDeleteUser,
    adminPromoteUser,
    adminFilterUsers,
} = sessionSlice.actions;

export default sessionSlice.reducer;

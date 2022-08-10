import { createSlice } from "@reduxjs/toolkit";

export const sessionSlice = createSlice({
    name: "session",
    initialState: {
        session: false,
        username: null,
        full_name: {
            first: "",
            last: "",
        },
        avatar: null,
        email: null,
        emailVerified: null,
        id: null,
        role: null,
        isGoogleUser: null,
        allUsersData: [],
        filtersApplied: {},
        usersFilteredData: [],
        isUserDataLoading: false,
    },
    reducers: {
        loadUserData: (state, action) => {
            const {
                session,
                username,
                full_name,
                avatar,
                email,
                emailVerified,
                id,
                role,
                isGoogleUser,
            } = action.payload;
            if (session !== undefined) state.session = session;
            if (username !== undefined) state.username = username;
            if (full_name !== undefined) state.full_name = full_name;
            if (avatar !== undefined) state.avatar = avatar;
            if (email !== undefined) state.email = email;
            if (emailVerified !== undefined) state.emailVerified = emailVerified;
            if (id !== undefined) state.id = id;
            if (role !== undefined) state.role = role;
            if (isGoogleUser !== undefined) state.isGoogleUser = isGoogleUser;
        },
        sessionActive: (state, action) => {
            state.session = action.payload;
        },
        /* loadUsername: (state, action) => {
          state.username = action.payload;
        },
        loadFullName: (state, action) => {
          state.full_name = action.payload;
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
        }, */
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
        loadingUserData: (state, action) => {
            state.isUserDataLoading = action.payload;
        },
    },
});

export const {
    loadUserData,
    loadingUserData,
    sessionActive,
    /* loadUsername,
    loadFullName,
    loadId,
    loadAvatar,
    loadEmail,
    loadRole,
    loadGoogleUser, */
    adminLoadUsers,
    adminDeleteUser,
    adminPromoteUser,
    adminFilterUsers,
} = sessionSlice.actions;

export default sessionSlice.reducer;

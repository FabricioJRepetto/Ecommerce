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
        isUserDataLoading: true,
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
        adminLoadUsers: (state, action) => {
            state.allUsersData = action.payload;
        },
        adminBanUser: (state, action) => {
            state.allUsersData = state.allUsersData.map((user) => {
                if (user._id === action.payload) return { ...user, role: "banned" };
                return user;
            });
        },
        adminUnbanUser: (state, action) => {
            state.allUsersData = state.allUsersData.map((user) => {
                if (user._id === action.payload) return { ...user, role: "client" };
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
    adminLoadUsers,
    adminBanUser,
    adminUnbanUser,
    adminPromoteUser,
    adminFilterUsers,
} = sessionSlice.actions;

export default sessionSlice.reducer;

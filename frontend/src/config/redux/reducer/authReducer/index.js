import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser, getAboutUser, getAllUsers, getConnectionsRequest, getMyConnectionRequests} from "../../action/authAction";


const initialState = {
    user: undefined,
    isError: false,
    isSuccess: false,
    isLoading: false,
    loggedIn: false,
    message: "",
    isTokenThere:false,
    profileFetched: false,
    connections: [],
    connectionRequest: [],
    all_users: [],
    all_profiles_fetched: []
};


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: () => initialState,
        hanleLoginUser: (state) => {
            state.message = "hello"
        },
        emptyMessage: (state) => {
            state.message = "";
        },
        setTokenIsThere: (state, action) => {
            state.isTokenThere = true;
        },
        setTokenIsNotThere: (state) => {
            state.isTokenThere = false;
        }
    },

    extraReducers: (builder) => {
        
        builder
        .addCase(loginUser.pending, (state) => {
            state.isLoading = true;
            state.message = "Logging In..."
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.loggedIn = true;
            state.message = "Login Successfull";
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload?.message;
        })
        .addCase(registerUser.pending, (state) => {
            state.isLoading = true;
            state.message = "Registering you...";
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.loggedIn = false;
            state.message = "Registration Successfull, Please Login";
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload?.message;
        })
        .addCase(getAboutUser.pending, (state) => {
            state.isLoading = true;
            state.message = "Fetching user info...";
            state.profileFetched = false;
        })
        .addCase(getAboutUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.profileFetched = true;
            state.user = action.payload;
            state.message = "User info fetched successfully";
        })
        .addCase(getAboutUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.profileFetched = false;
            state.message = action.payload?.message || "Failed to fetch user info";
            console.error("getAboutUser rejected:", action.payload);
        })
        .addCase(getAllUsers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.all_profiles_fetched = true;
            state.all_users = action.payload.profiles;
        })
        .addCase(getConnectionsRequest.fulfilled, (state, action) => {
            state.connections = action.payload
        })
        .addCase(getConnectionsRequest.rejected, (state, action) => {
            state.message = action.payload
        })
        .addCase(getMyConnectionRequests.fulfilled, (state, action) => {
            state.connectionRequest = action.payload
        })
        .addCase(getMyConnectionRequests.rejected, (state, action) => {
            state.message = action.payload
        })
    }
});


export const {reset, emptyMessage, setTokenIsThere, setTokenIsNotThere} = authSlice.actions;

export default authSlice.reducer;
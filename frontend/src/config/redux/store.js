import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer";

/**
 * 
 * Steps for State Management
 *
 * Submit Action
 * Handle action in it's reducer
 * Register Here -> reducer
 */



export const store = configureStore({
  reducer: {
    // Register your reducers here
    auth: authReducer,
    postReducer: postReducer,
  },
});

export default store;
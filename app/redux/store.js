"use client";
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import loadingReducer from './slice/loadingSlice';
import searchReducer from "./slice/searchSlice";
import cartReducer from "./slice/cartSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
    search: searchReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Disable serializable check for performance
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
      // Disable immutable check for better performance
      immutableCheck: {
        ignoredPaths: ['_persist'],
      },
    }),
  // Enable dev tools only in development
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;

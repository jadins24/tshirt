import { createSlice } from '@reduxjs/toolkit';

// Safely access localStorage or sessionStorage
const getAuthStateFromStorage = () => {
  if (typeof window !== "undefined") {
    const savedAuthState = localStorage.getItem('authState');
    return savedAuthState ? JSON.parse(savedAuthState) : null;
  }
  return null;
};

const initialState = getAuthStateFromStorage() || {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;

      if (typeof window !== "undefined") {
        localStorage.setItem('authState', JSON.stringify(action.payload));
        sessionStorage.setItem('authState', JSON.stringify(action.payload));
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("authState"); 
      }
    },
  },
});

export const { setAuthState, logout } = authSlice.actions;
export default authSlice.reducer;

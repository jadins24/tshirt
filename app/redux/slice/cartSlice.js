import { createSlice } from "@reduxjs/toolkit";

// Utility: Load data from localStorage
const getInitialCartState = () => {
  if (typeof window !== "undefined") {
    const cart = localStorage.getItem("cartState");

 return {
  cartData: cart ? JSON.parse(cart) : []

};

  }
  return {
    cartData: [],

  };
};

const cartSlice = createSlice({
  name: "cart",
  initialState: getInitialCartState(),
  reducers: {
    setCartData: (state, action) => {
      state.cartData = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("cartState", JSON.stringify(action.payload));
      }
    }
  },
});

export const { setCartData } = cartSlice.actions;
export default cartSlice.reducer;

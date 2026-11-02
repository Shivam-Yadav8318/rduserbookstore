
import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    products: [],
  },

  reducers: {
    // Add book only once
    addProduct: (state, action) => {
      const newProduct = action.payload;

      const productId = newProduct._id || newProduct.id;

      // Check whether the book already exists
      const existingProduct = state.products.find(
        (product) =>
          String(product._id || product.id) ===
          String(productId)
      );

      // Add only if the book is not already in the cart
      if (!existingProduct) {
        state.products.push({
          ...newProduct,
          quantity: 1,
        });
      }
    },

    // Remove book completely from cart
    deleteProduct: (state, action) => {
      state.products = state.products.filter(
        (product) =>
          String(product._id || product.id) !==
          String(action.payload)
      );
    },

    // Increase quantity using the + button
    increaseQuantity: (state, action) => {
      const product = state.products.find(
        (product) =>
          String(product._id || product.id) ===
          String(action.payload)
      );

      if (product) {
        product.quantity = (product.quantity || 1) + 1;
      }
    },

    // Decrease quantity using the - button
    decreaseQuantity: (state, action) => {
      const product = state.products.find(
        (product) =>
          String(product._id || product.id) ===
          String(action.payload)
      );

      if (product && (product.quantity || 1) > 1) {
        product.quantity -= 1;
      }
    },

    // Delete all products from cart
    DeleteCart: (state) => {
      state.products = [];
    },
  },
});

// Export Redux actions
export const {
  addProduct,
  deleteProduct,
  increaseQuantity,
  decreaseQuantity,
  DeleteCart,
} = cartSlice.actions;

// Export cart reducer
export default cartSlice.reducer;

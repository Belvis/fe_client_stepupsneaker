import { v4 as uuidv4 } from "uuid";
import cogoToast from "cogo-toast";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICartItem } from "../../interfaces";

export interface CartState {
  cartItems: ICartItem[];
}

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [] as ICartItem[],
  } as CartState,
  reducers: {
    addToCart(state, action: PayloadAction<ICartItem>) {
      const product = action.payload;

      const cartItem = state.cartItems.find(
        (item) => item.cartItemId === product.cartItemId
      );

      if (!cartItem) {
        state.cartItems.push({
          ...product,
          quantity: product.quantity ? product.quantity : 1,
          cartItemId: product.cartItemId,
          id: uuidv4(),
        });
      } else if (
        cartItem !== undefined &&
        (cartItem.selectedProductColor?.id !==
          product.selectedProductColor?.id ||
          cartItem.selectedProductSize?.id !== product.selectedProductSize?.id)
      ) {
        state.cartItems = [
          ...state.cartItems,
          {
            ...product,
            quantity: product.quantity ? product.quantity : 1,
            cartItemId: product.cartItemId,
            id: uuidv4(),
          },
        ];
      } else {
        state.cartItems = state.cartItems.map((item) => {
          if (item.cartItemId === cartItem.cartItemId) {
            return {
              ...item,
              quantity: product.quantity
                ? item.quantity + product.quantity
                : item.quantity + 1,
              selectedProductColor: product.selectedProductColor,
              selectedProductSize: product.selectedProductSize,
            };
          }
          return item;
        });
      }

      cogoToast.success("Added To Cart", { position: "top-center" });
    },
    deleteFromCart(state, action: PayloadAction<string | undefined>) {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload
      );
      cogoToast.error("Removed From Cart", { position: "top-center" });
    },
    decreaseQuantity(state, action: PayloadAction<ICartItem>) {
      const product = action.payload;
      if (product.quantity === 1) {
        state.cartItems = state.cartItems.filter(
          (item) => item.cartItemId !== product.cartItemId
        );
        cogoToast.error("Removed From Cart", { position: "top-center" });
      } else {
        state.cartItems = state.cartItems.map((item) =>
          item.cartItemId === product.cartItemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
        cogoToast.warn("Item Decremented From Cart", {
          position: "top-center",
        });
      }
    },
    deleteAllFromCart(state) {
      state.cartItems = [];
    },
  },
});

export const {
  addToCart,
  deleteFromCart,
  decreaseQuantity,
  deleteAllFromCart,
} = cartSlice.actions;
export default cartSlice.reducer;

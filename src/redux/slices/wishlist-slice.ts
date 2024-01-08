import cogoToast from "cogo-toast";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProductClient } from "../../interfaces";

export interface WishlistState {
  wishlistItems: IProductClient[];
}

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlistItems: [] as IProductClient[], // Initialize wishlistItems as an empty array
  } as WishlistState,
  reducers: {
    addToWishlist(state, action: PayloadAction<IProductClient>) {
      const isInWishlist = state.wishlistItems.findIndex(
        (item) => item.id === action.payload.id
      );
      if (isInWishlist > -1) {
        cogoToast.info("Product already in wishlist", {
          position: "top-center",
        });
      } else {
        state.wishlistItems.push(action.payload);
        cogoToast.success("Added To wishlist", { position: "top-center" });
      }
    },
    deleteFromWishlist(state, action: PayloadAction<string>) {
      state.wishlistItems = state.wishlistItems.filter(
        (item) => item.id !== action.payload
      );
      cogoToast.error("Removed From Wishlist", { position: "top-center" });
    },
    deleteAllFromWishlist(state) {
      state.wishlistItems = [];
    },
  },
});

export const { addToWishlist, deleteFromWishlist, deleteAllFromWishlist } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;

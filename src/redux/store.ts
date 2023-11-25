import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import orderReducer, { OrderState } from "./slices/order-slice";
import currencyReducer, { CurrencyState } from "./slices/currency-slice";
import cartReducer, { CartState } from "./slices/cart-slice";
import compareReducer, { CompareState } from "./slices/compare-slice";
import wishlistReducer, { WishlistState } from "./slices/wishlist-slice";

const persistConfig = {
  key: "suns",
  version: 1.1,
  storage,
  // blacklist: ["order"],
};

export const rootReducer = combineReducers({
  order: orderReducer,
  currency: currencyReducer,
  cart: cartReducer,
  compare: compareReducer,
  wishlist: wishlistReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = {
  order: OrderState;
  currency: CurrencyState;
  cart: CartState;
  compare: CompareState;
  wishlist: WishlistState;
};

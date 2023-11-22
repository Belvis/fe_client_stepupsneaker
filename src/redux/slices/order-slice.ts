import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IOrderRequest } from "../../interfaces";

export interface OrderState {
  order: IOrderRequest;
}

const orderSlice = createSlice({
  name: "product",
  initialState: {
    order: {} as IOrderRequest,
  } as OrderState,
  reducers: {
    setOrder(state, action: PayloadAction<IOrderRequest>) {
      state.order = action.payload;
    },
    deleteAll(state) {
      state.order = {} as IOrderRequest;
    },
  },
});

export const { setOrder } = orderSlice.actions;
export default orderSlice.reducer;

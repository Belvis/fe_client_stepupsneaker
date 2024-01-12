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
    clearOrder(state) {
      state.order = {} as IOrderRequest;
    },
  },
});

export const { setOrder, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;

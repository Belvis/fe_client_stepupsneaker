import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IOrderRequest, IVoucherResponse } from "../../interfaces";

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
    clearVoucher(state) {
      if (state.order && state.order.voucher) {
        delete state.order.voucher;
      }
    },
  },
});

export const { setOrder, clearOrder, clearVoucher } = orderSlice.actions;
export default orderSlice.reducer;

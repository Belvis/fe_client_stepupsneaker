import cogoToast from "cogo-toast";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProductClient } from "../../interfaces";

export interface CompareState {
  compareItems: IProductClient[];
}

const compareSlice = createSlice({
  name: "compare",
  initialState: {
    compareItems: [] as IProductClient[],
  } as CompareState,
  reducers: {
    addToCompare(state, action: PayloadAction<IProductClient>) {
      state.compareItems.push(action.payload);
      cogoToast.success("Đã thêm vào danh sách so sánh", {
        position: "top-center",
      });
    },
    deleteFromCompare(state, action: PayloadAction<string>) {
      state.compareItems = state.compareItems.filter(
        (item) => item.id !== action.payload
      );
      cogoToast.error("Đã xoá khỏi danh sách so sánh", {
        position: "top-center",
      });
    },
  },
});

export const { addToCompare, deleteFromCompare } = compareSlice.actions;
export default compareSlice.reducer;

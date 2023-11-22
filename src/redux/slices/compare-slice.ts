import cogoToast from "cogo-toast";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProductClient } from "../../interfaces";

interface CompareItem {
  id: string;
  // Add other properties as needed
}

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
      cogoToast.success("Added To compare", { position: "bottom-left" });
    },
    deleteFromCompare(state, action: PayloadAction<string>) {
      state.compareItems = state.compareItems.filter(
        (item) => item.id !== action.payload
      );
      cogoToast.error("Removed From Compare", { position: "bottom-left" });
    },
  },
});

export const { addToCompare, deleteFromCompare } = compareSlice.actions;
export default compareSlice.reducer;

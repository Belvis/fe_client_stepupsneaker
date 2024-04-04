import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CurrencyState {
  currencySymbol: string;
  currencyName: string;
  currencyRate: number;
}

const currencySlice = createSlice({
  name: "currency",
  initialState: {
    currencySymbol: "₫",
    currencyName: "VND",
    currencyRate: 1,
  } as CurrencyState,
  reducers: {
    setCurrency(state, action: PayloadAction<string>) {
      const currencyName = action.payload;

      if (currencyName === "USD") {
        return {
          ...state,
          currencySymbol: "$",
          currencyRate: 0.00004,
          currencyName,
        };
      }
      if (currencyName === "VND") {
        return {
          ...state,
          currencySymbol: "₫",
          currencyRate: 1,
          currencyName,
        };
      }

      return state;
    },
  },
});

export const { setCurrency } = currencySlice.actions;
export default currencySlice.reducer;

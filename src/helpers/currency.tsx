import { CurrencyState } from "../redux/slices/currency-slice";

export const CurrencyFormatter: React.FC<{
  value: number;
  currency: CurrencyState;
  className?: string | undefined;
}> = ({ value, currency, className }) => {
  return (
    <span className={className}>
      {new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: currency.currencyName,
        currencyDisplay: "symbol",
      }).format(value)}
    </span>
  );
};

import clsx from "clsx";
import LanguageCurrencyChanger from "./sub-components/LanguageCurrencyChanger";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { CurrencyFormatter } from "../../helpers/currency";

type HeaderTopProps = {
  borderStyle: string | undefined;
};

export const HeaderTop: React.FC<HeaderTopProps> = ({ borderStyle }) => {
  const currency = useSelector((state: RootState) => state.currency);
  return (
    <div
      className={clsx(
        "header-top-wap",
        borderStyle === "fluid-border" && "border-bottom"
      )}
    >
      <LanguageCurrencyChanger currency={currency} />
      <div className="header-offer">
        <p>
          Miễn phí vận chuyển cho đơn hàng trên{" "}
          <CurrencyFormatter value={20000000} currency={currency} />
        </p>
      </div>
    </div>
  );
};

export default HeaderTop;

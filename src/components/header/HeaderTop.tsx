import clsx from "clsx";
import LanguageCurrencyChanger from "./sub-components/LanguageCurrencyChanger";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { CurrencyFormatter } from "../../helpers/currency";
import { useTranslate } from "@refinedev/core";

type HeaderTopProps = {
  borderStyle: string | undefined;
};

export const HeaderTop: React.FC<HeaderTopProps> = ({ borderStyle }) => {
  const t = useTranslate();
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
          {t("common.free_shipping_message")}{" "}
          <CurrencyFormatter
            value={5000000 * currency.currencyRate}
            currency={currency}
          />
        </p>
      </div>
    </div>
  );
};

export default HeaderTop;

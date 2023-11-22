import PropTypes from "prop-types";
import clsx from "clsx";
import LanguageCurrencyChanger from "./sub-components/LanguageCurrencyChanger";

type HeaderTopProps = {
  borderStyle: string | undefined;
};

export const HeaderTop: React.FC<HeaderTopProps> = ({ borderStyle }) => {
  // const currency = useSelector((state) => state.currency);
  return (
    <div
      className={clsx(
        "header-top-wap",
        borderStyle === "fluid-border" && "border-bottom"
      )}
    >
      <LanguageCurrencyChanger currency={undefined} />
      <div className="header-offer">
        <p>
          Free delivery on order over{" "}
          <span>
            {/* {currency.currencySymbol + (200 * currency.currencyRate).toFixed(2)} */}
            0
          </span>
        </p>
      </div>
    </div>
  );
};

export default HeaderTop;

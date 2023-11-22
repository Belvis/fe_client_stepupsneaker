import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

type LanguageCurrencyChangerProps = {
  currency: any;
};

const LanguageCurrencyChanger: React.FC<
  LanguageCurrencyChangerProps
> = ({}) => {
  const { i18n } = useTranslation();
  // const dispatch = useDispatch();
  // const changeLanguageTrigger = e => {
  //   const languageCode = e.target.value;
  //   i18n.changeLanguage(languageCode);
  // };

  // const setCurrencyTrigger = e => {
  //   const currencyName = e.target.value;
  //   dispatch(setCurrency(currencyName));
  // };

  return (
    <div className="language-currency-wrap">
      <div className="same-language-currency language-style">
        <span>
          Tiếng Việt
          {/* {i18n.resolvedLanguage === "en"
            ? "English"
            : i18n.resolvedLanguage === "fn"
            ? "French"
            : i18n.resolvedLanguage === "de"
            ? "Germany"
            : ""}{" "} */}
          <i className="fa fa-angle-down" />
        </span>
        <div className="lang-car-dropdown">
          <ul>
            <li>
              {/* <button value="en" onClick={e => changeLanguageTrigger(e)}> */}
              <button value="en">English</button>
            </li>
            <li>
              {/* <button value="fn" onClick={e => changeLanguageTrigger(e)}> */}
              <button value="fn">French</button>
            </li>
            <li>
              {/* <button value="de" onClick={e => changeLanguageTrigger(e)}> */}
              <button value="de">Germany</button>
            </li>
          </ul>
        </div>
      </div>
      <div className="same-language-currency use-style">
        <span>
          {/* {currency.currencyName} <i className="fa fa-angle-down" /> */}
          "VNĐ" <i className="fa fa-angle-down" />
        </span>
        <div className="lang-car-dropdown">
          <ul>
            <li>
              {/* <button value="USD" onClick={e => setCurrencyTrigger(e)}> */}
              <button value="USD">USD</button>
            </li>
            <li>
              {/* <button value="EUR" onClick={e => setCurrencyTrigger(e)}> */}
              <button value="EUR">EUR</button>
            </li>
            <li>
              {/* <button value="GBP" onClick={e => setCurrencyTrigger(e)}> */}
              <button value="GBP">GBP</button>
            </li>
          </ul>
        </div>
      </div>
      <div className="same-language-currency">
        <p>Call Us 3965410</p>
      </div>
    </div>
  );
};
export default LanguageCurrencyChanger;

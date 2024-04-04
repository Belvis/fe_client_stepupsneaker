import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setCurrency } from "../../../redux/slices/currency-slice";
import TextScroller from "../../text/TextScroller";
import {
  Authenticated,
  useGetIdentity,
  useGetLocale,
  useSetLocale,
  useTranslate,
} from "@refinedev/core";
import { ICustomerResponse } from "../../../interfaces";
import dayjs from "dayjs";

type LanguageCurrencyChangerProps = {
  currency: any;
};

const LanguageCurrencyChanger: React.FC<LanguageCurrencyChangerProps> = ({
  currency,
}) => {
  const t = useTranslate();
  const locale = useGetLocale();
  const changeLanguage = useSetLocale();

  const currentLocale = locale();
  dayjs.locale(currentLocale);

  const dispatch = useDispatch();

  const changeLanguageTrigger = (e: React.MouseEvent<HTMLButtonElement>) => {
    const languageCode = e.currentTarget.value;
    changeLanguage(languageCode);
    dayjs.locale(languageCode);
  };

  const setCurrencyTrigger = (e: React.MouseEvent<HTMLButtonElement>) => {
    const currencyName = e.currentTarget.value;
    dispatch(setCurrency(currencyName));
  };

  const { data: user, refetch } = useGetIdentity<ICustomerResponse>();

  return (
    <div className="language-currency-wrap">
      <div className="same-language-currency language-style">
        <span>
          {currentLocale === "vi"
            ? "Tiếng Việt"
            : currentLocale === "en"
            ? "English"
            : ""}{" "}
          <i className="fa fa-angle-down" />
        </span>
        <div className="lang-car-dropdown">
          <ul>
            <li>
              <button value="vi" onClick={(e) => changeLanguageTrigger(e)}>
                Tiếng Việt
              </button>
            </li>
            <li>
              <button value="en" onClick={(e) => changeLanguageTrigger(e)}>
                English
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="same-language-currency use-style">
        <span>
          {currency.currencyName} <i className="fa fa-angle-down" />
        </span>
        <div className="lang-car-dropdown">
          <ul>
            <li>
              <button value="VND" onClick={(e) => setCurrencyTrigger(e)}>
                VND
              </button>
            </li>
            <li>
              <button value="USD" onClick={(e) => setCurrencyTrigger(e)}>
                USD
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="same-language-currency">
        <Authenticated
          key="same-language-currency"
          fallback={
            <p>
              {t("header.call_us")}:{" "}
              <span className="phone-number">0987654321</span>
            </p>
          }
        >
          {user && user.fullName ? (
            <TextScroller
              text={[
                <p>
                  {t("common.hi")}:{" "}
                  <span className="phone-number">{user.fullName}</span>
                </p>,
                <p>
                  {t("header.call_us")}:{" "}
                  <span className="phone-number">0987654321</span>
                </p>,
              ]}
            />
          ) : (
            <TextScroller
              text={[
                <p>
                  {t("common.hi")}:{" "}
                  <span className="phone-number">{t("header.dear_user")}</span>
                </p>,
                <p>
                  {t("header.call_us")}:{" "}
                  <span className="phone-number">0987654321</span>
                </p>,
              ]}
            />
          )}
        </Authenticated>
      </div>
    </div>
  );
};
export default LanguageCurrencyChanger;

import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setCurrency } from "../../../redux/slices/currency-slice";
import TextScroller from "../../text/TextScroller";
import { Authenticated, useGetIdentity } from "@refinedev/core";
import { ICustomerResponse } from "../../../interfaces";

type LanguageCurrencyChangerProps = {
  currency: any;
};

const LanguageCurrencyChanger: React.FC<LanguageCurrencyChangerProps> = ({
  currency,
}) => {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();

  const changeLanguageTrigger = (e: React.MouseEvent<HTMLButtonElement>) => {
    const languageCode = e.currentTarget.value;
    i18n.changeLanguage(languageCode);
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
          {i18n.resolvedLanguage === "vi"
            ? "Tiếng Việt"
            : i18n.resolvedLanguage === "en"
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
          fallback={
            <p>
              Gọi cho chúng tôi:{" "}
              <span className="phone-number">0987654321</span>
            </p>
          }
        >
          {user && user.fullName ? (
            <TextScroller
              text={[
                <p>
                  Xin chào:{" "}
                  <span className="phone-number">{user.fullName}</span>
                </p>,
                <p>
                  Gọi cho chúng tôi:{" "}
                  <span className="phone-number">0987654321</span>
                </p>,
              ]}
            />
          ) : (
            <TextScroller
              text={[
                <p>
                  Xin chào:{" "}
                  <span className="phone-number">Người dùng thân mến</span>
                </p>,
                <p>
                  Gọi cho chúng tôi:{" "}
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

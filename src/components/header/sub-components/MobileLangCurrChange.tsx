import { useGetLocale, useSetLocale, useTranslate } from "@refinedev/core";
import dayjs from "dayjs";
import { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrency } from "../../../redux/slices/currency-slice";
import { RootState } from "../../../redux/store";

const MobileLangCurrChange = () => {
  const t = useTranslate();
  const currency = useSelector((state: RootState) => state.currency);

  const locale = useGetLocale();
  const changeLanguage = useSetLocale();

  const currentLocale = locale();
  dayjs.locale(currentLocale);

  const dispatch = useDispatch();

  const changeLanguageTrigger = (e: ChangeEvent<HTMLSelectElement>) => {
    const languageCode = e.currentTarget.value;
    changeLanguage(languageCode);
    dayjs.locale(languageCode);

    closeMobileMenu();
  };

  const setCurrencyTrigger = (e: ChangeEvent<HTMLSelectElement>) => {
    const currencyName = e.currentTarget.value;
    dispatch(setCurrency(currencyName));

    closeMobileMenu();
  };

  const closeMobileMenu = () => {
    const offcanvasMobileMenu = document.querySelector(
      "#offcanvas-mobile-menu"
    );

    if (offcanvasMobileMenu) {
      offcanvasMobileMenu.classList.remove("active");
    }
  };

  return (
    <div className="mobile-menu-middle">
      <div className="lang-curr-style">
        <span className="title mb-2">
          {t("common.choose_language", "Choose Language")}
        </span>
        <select value={currentLocale} onChange={changeLanguageTrigger}>
          <option value="vi">Tiếng Việt</option>
          <option value="en">English</option>
        </select>
      </div>
      <div className="lang-curr-style">
        <span className="title mb-2">
          {t("common.choose_currency", "Choose Currency")}
        </span>
        <select value={currency.currencyName} onChange={setCurrencyTrigger}>
          <option value="VND">VND</option>
          <option value="USD">USD</option>
        </select>
      </div>
    </div>
  );
};

export default MobileLangCurrChange;

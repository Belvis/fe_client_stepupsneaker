import { useTranslation } from "react-i18next";

const MobileLangCurrChange = () => {
  const { i18n } = useTranslation();
  // const dispatch = useDispatch();
  // const currency = useSelector((state) => state.currency);

  const changeLanguageTrigger = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const languageCode = e.target.value;
    i18n.changeLanguage(languageCode);
    closeMobileMenu();
  };

  const setCurrencyTrigger = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const currencyName = e.target.value;
    // dispatch(setCurrency(currencyName));
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
        <span className="title mb-2">Choose Language </span>
        <select
          // value={i18n.resolvedLanguage}
          onChange={changeLanguageTrigger}
        >
          <option value="en">English</option>
          <option value="fn">French</option>
          <option value="de">Germany</option>
        </select>
      </div>
      <div className="lang-curr-style">
        <span className="title mb-2">Choose Currency</span>
        <select
          // value={currency.currencyName}
          onChange={setCurrencyTrigger}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
      </div>
    </div>
  );
};

export default MobileLangCurrChange;

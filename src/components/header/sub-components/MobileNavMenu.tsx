import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const MobileNavMenu = () => {
  const { t } = useTranslation();

  return (
    <nav className="offcanvas-navigation" id="offcanvas-navigation">
      <ul>
        <li>
          <Link to={"/"}>{t("nav.home")}</Link>
        </li>
        <li>
          <Link to={"/shop"}>{t("nav.shop")}</Link>
        </li>
        <li>
          <Link to={"/tracking"}>{t("nav.pages.tracking_page")}</Link>
        </li>
        <li className="menu-item-has-children">
          <Link to={"/"}>{t("nav.pages.title")}</Link>
          <ul className="sub-menu">
            <li className="menu-item-has-children">
              <Link to={"/pages/cart"}>{t("nav.pages.cart")}</Link>
            </li>
            <li className="menu-item-has-children">
              <Link to={"/pages/wishlist"}>{t("nav.pages.wishlist")}</Link>
            </li>
            <li className="menu-item-has-children">
              <Link to={"/pages/compare"}>{t("nav.pages.compare")}</Link>
            </li>
            <li className="menu-item-has-children">
              <Link to={"/pages/my-account"}>{t("nav.pages.my_account")}</Link>
            </li>
          </ul>
        </li>

        <li>
          <Link to={"/contact"}>{t("nav.contact_us")}</Link>
        </li>
        <li>
          <Link to={"/about_us"}>{t("nav.about_us")}</Link>
        </li>
        <li>
          <Link to={"/contact"}>{t("nav.contact_us")}</Link>
        </li>
      </ul>
    </nav>
  );
};

export default MobileNavMenu;

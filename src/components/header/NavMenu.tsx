import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

type NavMenuProps = {
  menuWhiteClass?: string;
  sidebarMenu?: boolean;
};

export const NavMenu: React.FC<NavMenuProps> = ({
  menuWhiteClass,
  sidebarMenu,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={clsx(
        sidebarMenu
          ? "sidebar-menu"
          : `main-menu ${menuWhiteClass ? menuWhiteClass : ""}`
      )}
    >
      <nav>
        <ul>
          <li>
            <Link to={"/"}>{t("nav.home")}</Link>
          </li>
          <li>
            <Link to={"/shop"}> {t("nav.shop")}</Link>
          </li>
          <li>
            <Link to={"/shop"}>{t("nav.collection")}</Link>
          </li>
          <li>
            <Link to={"/"}>
              {t("nav.pages.title")}
              {sidebarMenu ? (
                <span>
                  <i className="fa fa-angle-right"></i>
                </span>
              ) : (
                <i className="fa fa-angle-down" />
              )}
            </Link>
            <ul className="submenu">
              <li>
                <Link to={"/cart"}>{t("nav.pages.cart")}</Link>
              </li>
              <li>
                <Link to={"/checkout"}>{t("nav.pages.checkout")}</Link>
              </li>
              <li>
                <Link to={"/wishlist"}>{t("nav.pages.wishlist")}</Link>
              </li>
              <li>
                <Link to={"/compare"}>{t("nav.pages.compare")}</Link>
              </li>
              <li>
                <Link to={"/my-account"}>{t("nav.pages.my_account")}</Link>
              </li>
              <li>
                <Link to={"/login-register"}>
                  {t("nav.pages.login_register")}
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <Link to={"/contact"}>{t("nav.contact_us")}</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Fragment } from "react";

type NavMenuProps = {
  menuWhiteClass?: string;
  sidebarMenu?: boolean;
};

export const NavMenu: React.FC<NavMenuProps> = ({
  menuWhiteClass,
  sidebarMenu,
}) => {
  const { t } = useTranslation();

  const handleNavLinkClick = (event: React.MouseEvent) => {
    event.preventDefault();
  };

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
            <NavLink to={"/"}>{t("nav.home")}</NavLink>
          </li>
          <li>
            <NavLink to={"/shop"}>{t("nav.shop")}</NavLink>
          </li>
          <li>
            <NavLink to={"/tracking"}>{t("nav.pages.tracking_page")}</NavLink>
          </li>
          <li>
            <NavLink to={"/pages"} onClick={handleNavLinkClick}>
              {() => (
                <Fragment>
                  {t("nav.pages.title")}
                  {sidebarMenu ? (
                    <span>
                      <i className="fa fa-angle-right"></i>
                    </span>
                  ) : (
                    <i className="fa fa-angle-down" />
                  )}
                </Fragment>
              )}
            </NavLink>
            <ul className="submenu">
              <li>
                <NavLink to={"/pages/cart"}>{t("nav.pages.cart")}</NavLink>
              </li>
              <li>
                <NavLink to={"/pages/checkout"}>
                  {t("nav.pages.checkout")}
                </NavLink>
              </li>
              <li>
                <NavLink to={"/pages/wishlist"}>
                  {t("nav.pages.wishlist")}
                </NavLink>
              </li>
              <li>
                <NavLink to={"/pages/compare"}>
                  {t("nav.pages.compare")}
                </NavLink>
              </li>
              <li>
                <NavLink to={"/pages/my-account"}>
                  {t("nav.pages.my_account")}
                </NavLink>
              </li>
            </ul>
          </li>
          <li>
            <NavLink to={"/about_us"}>{t("nav.about_us")}</NavLink>
          </li>
          <li>
            <NavLink to={"/contact"}>{t("nav.contact_us")}</NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

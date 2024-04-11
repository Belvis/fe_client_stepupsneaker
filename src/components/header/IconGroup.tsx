import {
  Authenticated,
  useGetIdentity,
  useLogout,
  useTranslate,
} from "@refinedev/core";
import { Avatar, Button } from "antd";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ICustomerResponse } from "../../interfaces";
import { RootState } from "../../redux/store";
import MenuCart from "./sub-components/MenuCart";
import { getAvatarColor, getFirstLetterOfLastWord } from "../../helpers/avatar";

type IconGroupProps = {
  iconWhiteClass?: string;
};

export const IconGroup: React.FC<IconGroupProps> = ({ iconWhiteClass }) => {
  const t = useTranslate();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { mutate: logout } = useLogout();

  const { data: user, refetch } = useGetIdentity<ICustomerResponse>();

  const handleClick = (index: number) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleOutsideClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    if (activeIndex !== null && !target.closest(".active")) {
      setActiveIndex(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [activeIndex]);

  const triggerMobileMenu = () => {
    const offcanvasMobileMenu = document.querySelector(
      "#offcanvas-mobile-menu"
    );
    if (offcanvasMobileMenu) offcanvasMobileMenu.classList.add("active");
  };

  const { compareItems } = useSelector((state: RootState) => state.compare);
  const { wishlistItems } = useSelector((state: RootState) => state.wishlist);
  const { cartItems } = useSelector((state: RootState) => state.cart);

  return (
    <div className={clsx("header-right-wrap", iconWhiteClass)}>
      <div className="same-style header-search d-none d-lg-block">
        <button
          className={clsx("search-active", { active: activeIndex === 0 })}
          onClick={() => handleClick(0)}
        >
          <i className="pe-7s-search" />
        </button>
        <div className={clsx("search-content", { active: activeIndex === 0 })}>
          <form action="#">
            <input type="text" placeholder="Search" />
            <button className="button-search">
              <i className="pe-7s-search" />
            </button>
          </form>
        </div>
      </div>
      <div className="same-style account-setting d-none d-lg-block">
        <button
          className={clsx("account-setting-active", {
            active: activeIndex === 1,
          })}
          onClick={() => handleClick(1)}
        >
          <Authenticated
            key="account-setting"
            fallback={<i className="pe-7s-user-female" />}
          >
            {user && !user.image ? (
              <Avatar
                size={24}
                src={user.image}
                style={{ verticalAlign: "baseline" }}
              />
            ) : (
              <Avatar
                size={24}
                style={{
                  verticalAlign: "baseline",
                  alignItems: "baseline",
                  backgroundColor: getAvatarColor(user?.fullName),
                }}
              >
                <span>{getFirstLetterOfLastWord(user?.fullName)}</span>
              </Avatar>
            )}
          </Authenticated>
        </button>
        <div
          className={clsx("account-dropdown", { active: activeIndex === 1 })}
        >
          <ul>
            <Authenticated
              key="account-dropdown"
              fallback={
                <>
                  <li>
                    <Link to={"/login"}>{t("nav.pages./login")}</Link>
                  </li>
                  <li>
                    <Link to={"/register"}>{t("nav.pages./register")}</Link>
                  </li>
                </>
              }
            >
              <li>
                <Link to={"/pages/my-account"}>
                  {t("nav.pages.my_account")}
                </Link>
              </li>
              <li>
                <Link to={"/pages/my-account/orders"}>
                  {t("nav.pages.orders")}
                </Link>
              </li>
              <li>
                <Link to={"/"} onClick={() => logout()}>
                  {t("common.logout")}
                </Link>
              </li>
            </Authenticated>
          </ul>
        </div>
      </div>
      <div className="same-style header-compare">
        <Link to={"/pages/compare"}>
          <i className="pe-7s-shuffle" />
          <span className="count-style">
            {compareItems && compareItems.length ? compareItems.length : 0}
          </span>
        </Link>
      </div>
      <div className="same-style header-wishlist">
        <Link to={"/pages/wishlist"}>
          <i className="pe-7s-like" />
          <span className="count-style">
            {wishlistItems && wishlistItems.length ? wishlistItems.length : 0}
          </span>
        </Link>
      </div>
      <div className="same-style cart-wrap d-none d-lg-block">
        <button
          className={clsx("icon-cart", { active: activeIndex === 2 })}
          onClick={() => handleClick(2)}
        >
          <i className="pe-7s-shopbag" />
          <span className="count-style">
            {cartItems && cartItems.length ? cartItems.length : 0}
          </span>
        </button>
        {/* menu cart */}
        <MenuCart activeIndex={activeIndex} />
      </div>
      <div className="same-style cart-wrap d-block d-lg-none">
        <Link className="icon-cart" to={"/cart"}>
          <i className="pe-7s-shopbag" />
          <span className="count-style">
            {cartItems && cartItems.length ? cartItems.length : 0}
          </span>
        </Link>
      </div>
      <div className="same-style mobile-off-canvas d-block d-lg-none">
        <button
          className="mobile-aside-button"
          onClick={() => triggerMobileMenu()}
        >
          <i className="pe-7s-menu" />
        </button>
      </div>
    </div>
  );
};

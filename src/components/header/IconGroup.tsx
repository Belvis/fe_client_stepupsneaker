import { Link } from "react-router-dom";
import clsx from "clsx";
import MenuCart from "./sub-components/MenuCart";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Authenticated, useLogout } from "@refinedev/core";

type IconGroupProps = {
  iconWhiteClass?: string;
};

export const IconGroup: React.FC<IconGroupProps> = ({ iconWhiteClass }) => {
  const { mutate: logout } = useLogout();

  const handleClick = (e: React.MouseEvent) => {
    const nextSibling = e.currentTarget.nextSibling;

    if (nextSibling instanceof Element) {
      nextSibling.classList.toggle("active");
    }
  };

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
        <button className="search-active" onClick={(e) => handleClick(e)}>
          <i className="pe-7s-search" />
        </button>
        <div className="search-content">
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
          className="account-setting-active"
          onClick={(e) => handleClick(e)}
        >
          <i className="pe-7s-user-female" />
        </button>
        <div className="account-dropdown">
          <ul>
            <Authenticated
              fallback={
                <>
                  <li>
                    <Link to={"/pages/login"}>Đăng nhập</Link>
                  </li>
                  <li>
                    <Link to={"/pages/register"}>Đăng ký</Link>
                  </li>
                </>
              }
            >
              <li>
                <Link to={"/pages/my-account"}>Tài khoản</Link>
              </li>
              <li>
                <Link to={"/"} onClick={() => logout()}>
                  Đăng xuất
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
        <button className="icon-cart" onClick={(e) => handleClick(e)}>
          <i className="pe-7s-shopbag" />
          <span className="count-style">
            {cartItems && cartItems.length ? cartItems.length : 0}
          </span>
        </button>
        {/* menu cart */}
        <MenuCart />
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

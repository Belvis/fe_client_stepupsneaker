import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../../redux/store";
import { getDiscountPrice } from "../../../helpers/product";
import { deleteFromCart } from "../../../redux/slices/cart-slice";
import { NumberField } from "@refinedev/antd";
import { useTranslation } from "react-i18next";

const MenuCart = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const currency = useSelector((state: RootState) => state.currency);
  const { cartItems } = useSelector((state: RootState) => state.cart);
  let cartTotalPrice = 0;

  return (
    <div className="shopping-cart-content">
      {cartItems && cartItems.length > 0 ? (
        <Fragment>
          <ul>
            {cartItems.map((item) => {
              const discountedPrice = getDiscountPrice(
                item.selectedProductSize?.price ?? 0,
                0
              );
              const finalProductPrice = (
                (item.selectedProductSize?.price ?? 0) * currency.currencyRate
              ).toFixed(2);

              const finalDiscountedPrice =
                discountedPrice !== null
                  ? parseFloat(
                      (discountedPrice * currency.currencyRate).toFixed(2)
                    )
                  : 0.0;

              discountedPrice !== null
                ? (cartTotalPrice += finalDiscountedPrice * item.quantity)
                : (cartTotalPrice +=
                    parseFloat(finalProductPrice) * item.quantity);

              return (
                <li className="single-shopping-cart" key={item.id}>
                  <div className="shopping-cart-img">
                    <Link to={"/product/" + item.id}>
                      <img alt="" src={item.image} className="img-fluid" />
                    </Link>
                  </div>
                  <div className="shopping-cart-title">
                    <h4>
                      <Link to={"/product/" + item.id}> {item.name} </Link>
                    </h4>
                    <h6>
                      {t("header.menu_cart.qty")}: {item.quantity}
                    </h6>
                    <span>
                      <NumberField
                        value={
                          discountedPrice !== null
                            ? finalDiscountedPrice
                            : finalProductPrice
                        }
                        options={{
                          currency: currency.currencyName,
                          style: "currency",
                          currencyDisplay: "symbol",
                        }}
                      />
                    </span>
                    {item.selectedProductColor && item.selectedProductSize ? (
                      <div className="cart-item-variation">
                        <span>
                          {t("header.menu_cart.color")}:{" "}
                          {item.selectedProductColor.name}
                        </span>
                        <span>
                          {t("header.menu_cart.size")}:{" "}
                          {item.selectedProductSize.name}
                        </span>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="shopping-cart-delete">
                    <button onClick={() => dispatch(deleteFromCart(item?.id))}>
                      <i className="fa fa-times-circle" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="shopping-cart-total">
            <h4>
              {t("header.menu_cart.total")} :{" "}
              <span className="shop-total">
                <NumberField
                  value={cartTotalPrice}
                  options={{
                    currency: currency.currencyName,
                    style: "currency",
                    currencyDisplay: "symbol",
                  }}
                />
              </span>
            </h4>
          </div>
          <div className="shopping-cart-btn btn-hover text-center">
            <Link className="default-btn" to={"/pages/cart"}>
              {t("header.menu_cart.buttons.view_cart")}
            </Link>
            <Link className="default-btn" to={"/pages/checkout"}>
              {t("header.menu_cart.buttons.checkout")}
            </Link>
          </div>
        </Fragment>
      ) : (
        <p className="text-center">{t("header.menu_cart.no_items")}</p>
      )}
    </div>
  );
};

export default MenuCart;

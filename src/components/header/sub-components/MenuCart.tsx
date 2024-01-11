import { GiftOutlined } from "@ant-design/icons";
import {
  Authenticated,
  HttpError,
  useGetIdentity,
  useList,
} from "@refinedev/core";
import { Typography } from "antd";
import clsx from "clsx";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FREE_SHIPPING_THRESHOLD } from "../../../constants";
import { CurrencyFormatter, formatCurrency } from "../../../helpers/currency";
import { getDiscountPrice } from "../../../helpers/product";
import { ICustomerResponse, IVoucherResponse } from "../../../interfaces";
import { deleteFromCart, deleteFromDB } from "../../../redux/slices/cart-slice";
import { AppDispatch, RootState } from "../../../redux/store";
import { DiscountMessage, DiscountMoney } from "../../../styled/CartStyled";

const { Title } = Typography;

type MenuCartProps = {
  activeIndex: number | null;
};

const MenuCart: React.FC<MenuCartProps> = ({ activeIndex }) => {
  const { t } = useTranslation();

  const dispatch: AppDispatch = useDispatch();
  const currency = useSelector((state: RootState) => state.currency);
  const { cartItems } = useSelector((state: RootState) => state.cart);

  let cartTotalPrice = 0;

  const { data: user } = useGetIdentity<ICustomerResponse>();

  const {
    data,
    isLoading: isLoadingVoucher,
    isError,
  } = useList<IVoucherResponse, HttpError>({
    resource: "vouchers",
    pagination: {
      pageSize: 1000,
    },
    filters: [
      {
        field: "customer",
        operator: "eq",
        value: user?.id,
      },
    ],
  });

  // Todo: lưu identity vào local để đỡ phải call

  const vouchers = data?.data ? data?.data : [];

  const [legitVouchers, setLegitVouchers] = useState<IVoucherResponse[]>([]);

  useEffect(() => {
    if (vouchers) {
      const convertedLegitVoucher = vouchers.map((voucher) => {
        const updatedVoucher = { ...voucher };
        if (voucher.type === "PERCENTAGE") {
          updatedVoucher.value = (voucher.value * cartTotalPrice) / 100;
        }
        return updatedVoucher;
      });

      convertedLegitVoucher.sort((a, b) => b.value - a.value);
      setLegitVouchers(convertedLegitVoucher);
    }
  }, [vouchers]);

  return (
    <div
      className={clsx("shopping-cart-content", { active: activeIndex === 2 })}
    >
      {cartItems && cartItems.length > 0 ? (
        <Fragment>
          <ul>
            {cartItems.map((item) => {
              const discountedPrice = getDiscountPrice(
                item.selectedProductSize?.price ?? 0,
                0
              );
              const finalProductPrice =
                (item.selectedProductSize?.price ?? 0) * currency.currencyRate;

              const finalDiscountedPrice =
                discountedPrice !== null
                  ? discountedPrice * currency.currencyRate
                  : 0.0;

              discountedPrice !== null
                ? (cartTotalPrice += finalDiscountedPrice * item.quantity)
                : (cartTotalPrice += finalProductPrice * item.quantity);

              return (
                <li className="single-shopping-cart" key={item.id}>
                  <div className="shopping-cart-img">
                    <Link to={"/product/" + item.cartItemId}>
                      <img alt="" src={item.image} className="img-fluid" />
                    </Link>
                  </div>
                  <div className="shopping-cart-title">
                    <h4>
                      <Link to={"/product/" + item.cartItemId}>
                        {" "}
                        {item.name}{" "}
                      </Link>
                    </h4>
                    <h6>
                      {t("header.menu_cart.qty")}: {item.quantity}
                    </h6>
                    <CurrencyFormatter
                      value={
                        discountedPrice !== null
                          ? finalDiscountedPrice
                          : finalProductPrice
                      }
                      currency={currency}
                    />
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
                    <Authenticated
                      fallback={
                        <button
                          onClick={() => dispatch(deleteFromCart(item?.id))}
                        >
                          <i className="fa fa-times-circle" />
                        </button>
                      }
                    >
                      <button onClick={() => dispatch(deleteFromDB(item?.id))}>
                        <i className="fa fa-times-circle" />
                      </button>
                    </Authenticated>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="shopping-cart-total">
            {cartTotalPrice < FREE_SHIPPING_THRESHOLD ? (
              <DiscountMessage>
                <GiftOutlined /> Mua thêm{" "}
                <DiscountMoney>
                  {formatCurrency(
                    FREE_SHIPPING_THRESHOLD - cartTotalPrice,
                    currency
                  )}
                </DiscountMoney>{" "}
                để được miễn phí vận chuyển
              </DiscountMessage>
            ) : (
              ""
            )}
            {legitVouchers.length > 0 && (
              <DiscountMessage>
                <GiftOutlined /> Mua thêm{" "}
                <DiscountMoney>
                  {formatCurrency(
                    legitVouchers[0].constraint - cartTotalPrice,
                    currency
                  )}
                </DiscountMoney>{" "}
                để được giảm tới{" "}
                <DiscountMoney>
                  {formatCurrency(legitVouchers[0].value, currency)}
                </DiscountMoney>
              </DiscountMessage>
            )}
            <Title level={4}>
              {t("header.menu_cart.total")} :{" "}
              <CurrencyFormatter
                className="shop-total"
                value={cartTotalPrice}
                currency={currency}
              />
            </Title>
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

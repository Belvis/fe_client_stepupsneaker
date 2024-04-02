import { GiftOutlined } from "@ant-design/icons";
import { Authenticated, useGetIdentity } from "@refinedev/core";
import { Typography } from "antd";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import _ from "lodash";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FREE_SHIPPING_THRESHOLD } from "../../../constants";
import { CHILDREN_VARIANT, PARENT_VARIANT } from "../../../constants/motions";
import { CurrencyFormatter, formatCurrency } from "../../../helpers/currency";
import { getDiscountPrice } from "../../../helpers/product";
import { ICustomerResponse, IVoucherList } from "../../../interfaces";
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

  // Todo: lưu identity vào local để đỡ phải call

  const [legitVouchers, setLegitVouchers] = useState<IVoucherList[]>([]);

  useEffect(() => {
    if (user && user.customerVoucherList) {
      const convertedLegitVoucher = _.cloneDeep(user.customerVoucherList);
      convertedLegitVoucher.map((single) => {
        const updatedVoucher = { ...single };
        if (single.voucher.type === "PERCENTAGE") {
          updatedVoucher.voucher.value =
            (single.voucher.value * cartTotalPrice) / 100;
        }
        return updatedVoucher;
      });

      convertedLegitVoucher.sort((a, b) => b.voucher.value - a.voucher.value);
      setLegitVouchers(convertedLegitVoucher);
    }
  }, [user]);

  return (
    <div
      className={clsx("shopping-cart-content", { active: activeIndex === 2 })}
    >
      {cartItems && cartItems.length > 0 ? (
        <Fragment>
          <AnimatePresence mode="wait">
            <motion.ul
              layout
              variants={PARENT_VARIANT}
              initial="hidden"
              animate="show"
            >
              {cartItems.map((item) => {
                const discountValue = item.selectedProductSize?.discount ?? 0;
                const discountedPrice = getDiscountPrice(
                  item.selectedProductSize?.price ?? 0,
                  discountValue
                );
                const finalProductPrice =
                  (item.selectedProductSize?.price ?? 0) *
                  currency.currencyRate;

                const finalDiscountedPrice =
                  discountedPrice !== null
                    ? discountedPrice * currency.currencyRate
                    : 0.0;

                discountedPrice !== null
                  ? (cartTotalPrice += finalDiscountedPrice * item.quantity)
                  : (cartTotalPrice += finalProductPrice * item.quantity);

                return (
                  <motion.li
                    layout
                    variants={CHILDREN_VARIANT}
                    key={item.id}
                    className="single-shopping-cart"
                  >
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
                        <button
                          onClick={() => dispatch(deleteFromDB(item?.id))}
                        >
                          <i className="fa fa-times-circle" />
                        </button>
                      </Authenticated>
                    </div>
                  </motion.li>
                );
              })}
            </motion.ul>
          </AnimatePresence>
          <div className="shopping-cart-total mt-2">
            {(() => {
              const freeShippingDifference =
                cartTotalPrice < FREE_SHIPPING_THRESHOLD
                  ? FREE_SHIPPING_THRESHOLD - cartTotalPrice
                  : Infinity;

              const voucherDifference =
                legitVouchers && legitVouchers.length > 0
                  ? cartTotalPrice < legitVouchers[0].voucher.constraint
                    ? legitVouchers[0].voucher.constraint - cartTotalPrice
                    : Infinity
                  : Infinity;

              const shouldDisplayFreeShipping =
                freeShippingDifference > 0 &&
                freeShippingDifference !== Infinity &&
                freeShippingDifference <= voucherDifference;
              const shouldDisplayVoucher =
                voucherDifference > 0 &&
                voucherDifference !== Infinity &&
                voucherDifference < freeShippingDifference;

              if (shouldDisplayFreeShipping) {
                return (
                  <DiscountMessage>
                    <GiftOutlined /> Mua thêm{" "}
                    <DiscountMoney>
                      {formatCurrency(freeShippingDifference, currency)}
                    </DiscountMoney>{" "}
                    để được miễn phí vận chuyển
                  </DiscountMessage>
                );
              } else if (shouldDisplayVoucher) {
                return (
                  <DiscountMessage>
                    <GiftOutlined /> Mua thêm{" "}
                    <DiscountMoney>
                      {formatCurrency(voucherDifference, currency)}
                    </DiscountMoney>{" "}
                    để được giảm tới{" "}
                    <DiscountMoney>
                      {formatCurrency(legitVouchers[0].voucher.value, currency)}
                    </DiscountMoney>
                  </DiscountMessage>
                );
              } else {
                return null;
              }
            })()}

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
        <motion.div
          initial={{ x: "50%" }}
          animate={{ x: "0%" }}
          exit={{ x: "50%" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-center">{t("header.menu_cart.no_items")}</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default MenuCart;

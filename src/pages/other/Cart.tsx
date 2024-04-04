import { useDocumentTitle } from "@refinedev/react-router-v6";
import { motion } from "framer-motion";
import { Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import CartFormSection from "../../components/cart/CartFormSection";
import CartItemsTable from "../../components/cart/CartItemsTable";
import { RootState } from "../../redux/store";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";

const Cart = () => {
  const { t } = useTranslation();
  let { pathname } = useLocation();

  const setTitle = useDocumentTitle();

  useEffect(() => {
    setTitle(t("nav.pages.cart") + " | SUNS");
  }, [t]);

  let cartTotalPrice = 0;
  let discount = 0;

  const currency = useSelector((state: RootState) => state.currency);
  const { cartItems } = useSelector((state: RootState) => state.cart);

  const { order } = useSelector((state: RootState) => state.order);

  return (
    <Fragment>
      <Breadcrumb
        pages={[
          { label: "home", path: "/" },
          { label: "pages.cart", path: pathname },
        ]}
      />
      <div className="cart-main-area pt-90 pb-100 bg-white">
        <div className="container">
          {cartItems && cartItems.length >= 1 ? (
            <Fragment>
              <CartItemsTable
                cartItems={cartItems}
                currency={currency}
                cartTotalPrice={cartTotalPrice}
                discount={discount}
                order={order}
              />

              <CartFormSection
                currency={currency}
                order={order}
                cartTotalPrice={cartTotalPrice}
                discount={discount}
              />
            </Fragment>
          ) : (
            <motion.div
              className="row"
              initial={{ x: "50%" }}
              animate={{ x: "0%" }}
              exit={{ x: "50%" }}
            >
              <motion.div
                className="col-lg-12"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="item-empty-area text-center">
                  <div className="item-empty-area__icon mb-30">
                    <i className="pe-7s-cart"></i>
                  </div>
                  <div className="item-empty-area__text">
                    {t(`cart.no_items_found`)}
                    <br />{" "}
                    <Link to={"/shop"}>{t(`cart.buttons.add_items`)}</Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Cart;

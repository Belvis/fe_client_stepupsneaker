import { Authenticated, useTranslate } from "@refinedev/core";
import { motion } from "framer-motion";
import { Fragment, useState } from "react";
import { CHILDREN_VARIANT, PARENT_VARIANT } from "../../constants/motions";
import {
  cartItemStock,
  getDiscountPrice,
  getTotalCartQuantity,
} from "../../helpers/product";
import { Link } from "react-router-dom";
import { CurrencyFormatter } from "../../helpers/currency";
import { showWarningConfirmDialog } from "../../helpers/confirm";
import {
  addToCart,
  addToDB,
  decreaseFromDB,
  decreaseQuantity,
  deleteAllFromCart,
  deleteAllFromDB,
  deleteFromCart,
  deleteFromDB,
  updateCartItemQuantity,
  updateFromDB,
} from "../../redux/slices/cart-slice";
import { showErrorToast } from "../../helpers/toast";
import { ICartItem, IOrderRequest } from "../../interfaces";
import { CurrencyState } from "../../redux/slices/currency-slice";
import { AppDispatch } from "../../redux/store";
import { useDispatch } from "react-redux";
import { debounce } from "lodash";

type CartItemsTableProps = {
  cartItems: ICartItem[];
  currency: CurrencyState;
  order: IOrderRequest;
  discount: number;
  cartTotalPrice: number;
};

const CartItemsTable: React.FC<CartItemsTableProps> = ({
  cartItems,
  currency,
  order,
  discount,
  cartTotalPrice,
}) => {
  const t = useTranslate();
  const dispatch: AppDispatch = useDispatch();

  const sortedCartItems = [...cartItems].sort((a, b) => {
    return (a.createdAt ?? 0) - (b.createdAt ?? 0);
  });

  const totalCartQty = getTotalCartQuantity(cartItems);
  const [quantityCount] = useState(1);

  const updateQuantity = (cartItem: any) => {
    dispatch(updateCartItemQuantity(cartItem));
  };

  const updateQuantityFromDB = debounce((cartItem: ICartItem) => {
    dispatch(updateFromDB(cartItem));
  }, 500);

  return (
    <Fragment>
      <h3 className="cart-page-title">{t(`cart.title`)}</h3>
      <div className="row">
        <div className="col-12">
          <div className="table-content table-responsive cart-table-content">
            <motion.table layout style={{ overflow: "hidden" }}>
              <motion.thead layout>
                <motion.tr>
                  <th>{t(`cart.table.head.image`)}</th>
                  <th>{t(`cart.table.head.product_name`)}</th>
                  <th>{t(`cart.table.head.unit_price`)}</th>
                  <th>{t(`cart.table.head.qty`)}</th>
                  <th>{t(`cart.table.head.subtotal`)}</th>
                  <th>{t(`cart.table.head.action`)}</th>
                </motion.tr>
              </motion.thead>
              <motion.tbody
                layout
                variants={PARENT_VARIANT}
                initial="hidden"
                animate="show"
              >
                {sortedCartItems &&
                  sortedCartItems.map((cartItem, key) => {
                    const discountValue =
                      cartItem.selectedProductSize?.discount ?? 0;
                    const discountedPrice = getDiscountPrice(
                      cartItem.selectedProductSize?.price ?? 0,
                      discountValue
                    );
                    const finalProductPrice =
                      (cartItem.selectedProductSize?.price ?? 0) *
                      currency.currencyRate;
                    const finalDiscountedPrice =
                      discountedPrice !== null
                        ? discountedPrice * currency.currencyRate
                        : 0.0;

                    discountedPrice !== null
                      ? (cartTotalPrice +=
                          finalDiscountedPrice * cartItem.quantity)
                      : (cartTotalPrice +=
                          finalProductPrice * cartItem.quantity);

                    discount = order.voucher
                      ? order.voucher.type == "PERCENTAGE"
                        ? (order.voucher.value * cartTotalPrice) / 100
                        : order.voucher.value
                      : 0;

                    return (
                      <motion.tr key={key} layout variants={CHILDREN_VARIANT}>
                        <td className="product-thumbnail">
                          <Link to={"/product/" + cartItem.cartItemId}>
                            <img
                              className="img-fluid"
                              src={cartItem.image}
                              alt=""
                            />
                          </Link>
                        </td>

                        <td className="product-name">
                          <Link to={"/product/" + cartItem.cartItemId}>
                            {cartItem.name}
                          </Link>
                          {cartItem.selectedProductColor &&
                          cartItem.selectedProductSize ? (
                            <div className="cart-item-variation">
                              <span>
                                {t(`cart.table.head.color`)}:{" "}
                                {cartItem.selectedProductColor.name}
                              </span>
                              <span>
                                {t(`cart.table.head.size`)}:{" "}
                                {cartItem.selectedProductSize.name}
                              </span>
                            </div>
                          ) : (
                            ""
                          )}
                        </td>

                        <td className="product-price-cart">
                          {discountedPrice !== null ? (
                            <Fragment>
                              <CurrencyFormatter
                                className="amount old"
                                value={finalProductPrice}
                                currency={currency}
                              />
                              <CurrencyFormatter
                                className="amount"
                                value={finalDiscountedPrice}
                                currency={currency}
                              />
                            </Fragment>
                          ) : (
                            <CurrencyFormatter
                              className="amount"
                              value={finalProductPrice}
                              currency={currency}
                            />
                          )}
                        </td>

                        <td className="product-quantity">
                          <div className="cart-plus-minus">
                            <Authenticated
                              key="dec qtybutton"
                              fallback={
                                <button
                                  className="dec qtybutton"
                                  onClick={() => {
                                    if (cartItem.quantity <= 1) {
                                      showWarningConfirmDialog({
                                        options: {
                                          message:
                                            "Giảm số lượng về 0 tương đương với việc loại bỏ sản phẩm khỏi giỏ",
                                          accept: () => {
                                            dispatch(
                                              decreaseQuantity(cartItem)
                                            );
                                          },
                                          reject: () => {},
                                        },
                                        t: t,
                                      });
                                    } else {
                                      dispatch(decreaseQuantity(cartItem));
                                    }
                                  }}
                                >
                                  -
                                </button>
                              }
                            >
                              <button
                                className="dec qtybutton"
                                onClick={() => {
                                  if (cartItem.quantity <= 1) {
                                    showWarningConfirmDialog({
                                      options: {
                                        message:
                                          "Giảm số lượng về 0 tương đương với việc loại bỏ sản phẩm khỏi giỏ",
                                        accept: () => {
                                          dispatch(decreaseFromDB(cartItem));
                                        },
                                        reject: () => {},
                                      },
                                      t: t,
                                    });
                                  } else {
                                    dispatch(decreaseFromDB(cartItem));
                                  }
                                }}
                              >
                                -
                              </button>
                            </Authenticated>
                            <Authenticated
                              key="cart-plus-minus-box"
                              fallback={
                                <input
                                  className="cart-plus-minus-box"
                                  type="text"
                                  value={cartItem.quantity}
                                  onChange={(e) => {
                                    const newValue = parseInt(
                                      e.target.value,
                                      10
                                    );

                                    if (
                                      newValue >=
                                      cartItemStock(
                                        cartItem.selectedProductSize
                                      )
                                    ) {
                                      return showErrorToast(
                                        t("products.message.min_reached")
                                      );
                                    }
                                    if (newValue > 5 || totalCartQty >= 5) {
                                      return showErrorToast(
                                        t("products.message.max_cart_size")
                                      );
                                    }
                                    if (!isNaN(newValue)) {
                                      updateQuantity({
                                        ...cartItem,
                                        quantity: newValue,
                                      });
                                    }
                                  }}
                                />
                              }
                            >
                              <input
                                className="cart-plus-minus-box"
                                type="text"
                                value={cartItem.quantity}
                                onChange={(e) => {
                                  const newValue = parseInt(e.target.value, 10);

                                  if (
                                    newValue >=
                                    cartItemStock(cartItem.selectedProductSize)
                                  ) {
                                    return showErrorToast(
                                      t("products.message.min_reached")
                                    );
                                  }
                                  if (newValue > 5 || totalCartQty >= 5) {
                                    return showErrorToast(
                                      t("products.message.max_cart_size")
                                    );
                                  }
                                  if (!isNaN(newValue)) {
                                    updateQuantity({
                                      ...cartItem,
                                      quantity: newValue,
                                      showNoti: false,
                                    });
                                    updateQuantityFromDB({
                                      ...cartItem,
                                      quantity: newValue,
                                    });
                                  }
                                }}
                              />
                            </Authenticated>
                            <Authenticated
                              key="inc qtybutton"
                              fallback={
                                <button
                                  className="inc qtybutton"
                                  onClick={() => {
                                    if (
                                      cartItem !== undefined &&
                                      cartItem.quantity !== undefined &&
                                      cartItem.quantity >=
                                        cartItemStock(
                                          cartItem.selectedProductSize
                                        )
                                    ) {
                                      return showErrorToast(
                                        t("products.message.min_reached")
                                      );
                                    }

                                    if (
                                      cartItem.quantity >= 5 ||
                                      totalCartQty >= 5
                                    ) {
                                      return showErrorToast(
                                        t("products.message.max_cart_size")
                                      );
                                    }
                                    dispatch(
                                      addToCart({
                                        ...cartItem,
                                        quantity: quantityCount,
                                      })
                                    );
                                  }}
                                >
                                  +
                                </button>
                              }
                            >
                              <button
                                className="inc qtybutton"
                                onClick={() => {
                                  if (
                                    cartItem !== undefined &&
                                    cartItem.quantity !== undefined &&
                                    cartItem.quantity >=
                                      cartItemStock(
                                        cartItem.selectedProductSize
                                      )
                                  ) {
                                    return showErrorToast(
                                      t("products.message.min_reached")
                                    );
                                  }

                                  if (
                                    cartItem.quantity >= 5 ||
                                    totalCartQty >= 5
                                  ) {
                                    return showErrorToast(
                                      t("products.message.max_cart_size")
                                    );
                                  }
                                  dispatch(
                                    addToDB({
                                      ...cartItem,
                                      quantity: quantityCount,
                                    })
                                  );
                                }}
                              >
                                +
                              </button>
                            </Authenticated>
                          </div>
                        </td>
                        <td className="product-subtotal">
                          <CurrencyFormatter
                            className="amount"
                            value={
                              discountedPrice !== null
                                ? finalDiscountedPrice * cartItem.quantity
                                : finalProductPrice * cartItem.quantity
                            }
                            currency={currency}
                          />
                        </td>

                        <td className="product-remove">
                          <Authenticated
                            key="product-remove"
                            fallback={
                              <button
                                onClick={() =>
                                  dispatch(deleteFromCart(cartItem.id))
                                }
                              >
                                <i className="fa fa-times"></i>
                              </button>
                            }
                          >
                            <button
                              onClick={() =>
                                dispatch(deleteFromDB(cartItem.id))
                              }
                            >
                              <i className="fa fa-times"></i>
                            </button>
                          </Authenticated>
                        </td>
                      </motion.tr>
                    );
                  })}
              </motion.tbody>
            </motion.table>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="cart-shiping-update-wrapper">
            <div className="cart-shiping-update">
              <Link to={"/shop"}>{t(`cart.buttons.continue_shopping`)}</Link>
            </div>
            <div className="cart-clear">
              <Authenticated
                key="cart-clear"
                fallback={
                  <button onClick={() => dispatch(deleteAllFromCart())}>
                    {t(`cart.buttons.clear_cart`)}
                  </button>
                }
              >
                <button onClick={() => dispatch(deleteAllFromDB())}>
                  {t(`cart.buttons.clear_cart`)}
                </button>
              </Authenticated>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CartItemsTable;

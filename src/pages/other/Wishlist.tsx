import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { getDiscountPrice } from "../../helpers/product";
import {
  deleteAllFromWishlist,
  deleteFromWishlist,
} from "../../redux/slices/wishlist-slice";
import { RootState } from "../../redux/store";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useDocumentTitle } from "@refinedev/react-router-v6";

const Wishlist = () => {
  const { t } = useTranslation();

  useDocumentTitle(t("nav.pages.wishlist") + " | SUNS");

  const dispatch = useDispatch();
  let { pathname } = useLocation();

  const currency = useSelector((state: RootState) => state.currency);
  const { wishlistItems } = useSelector((state: RootState) => state.wishlist);

  return (
    <Fragment>
      <Breadcrumb
        pages={[
          { label: "home", path: "/" },
          { label: "pages.wishlist", path: pathname },
        ]}
      />
      <div className="cart-main-area pt-90 pb-100 bg-white">
        <div className="container">
          {wishlistItems && wishlistItems.length >= 1 ? (
            <Fragment>
              <h3 className="cart-page-title">{t(`wish_list.title`)}</h3>
              <div className="row">
                <div className="col-12">
                  <div className="table-content table-responsive cart-table-content">
                    <table>
                      <thead>
                        <tr>
                          <th>{t(`wish_list.table.head.image`)}</th>
                          <th>{t(`wish_list.table.head.product_name`)}</th>
                          <th>{t(`wish_list.table.head.unit_price`)}</th>
                          <th>{t(`wish_list.table.head.add_to_cart`)}</th>
                          <th>{t(`wish_list.table.head.action`)}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {wishlistItems.map((wishlistItem, key) => {
                          const discountedPrice = getDiscountPrice(
                            wishlistItem.price.max,
                            wishlistItem.discount
                          );
                          const finalProductPrice = (
                            wishlistItem.price.max * currency.currencyRate
                          ).toFixed(2);
                          const finalDiscountedPrice = +(
                            (discountedPrice ?? wishlistItem.discount) *
                            currency.currencyRate
                          ).toFixed(2);

                          return (
                            <tr key={key}>
                              <td className="product-thumbnail">
                                <Link to={"/product/" + wishlistItem.id}>
                                  <img
                                    className="img-fluid"
                                    src={wishlistItem.image[0]}
                                    alt=""
                                  />
                                </Link>
                              </td>

                              <td className="product-name text-center">
                                <Link to={"/product/" + wishlistItem.id}>
                                  {wishlistItem.name}
                                </Link>
                              </td>

                              <td className="product-price-cart">
                                {discountedPrice !== null ? (
                                  <Fragment>
                                    <span className="amount old">
                                      {new Intl.NumberFormat("en-US", {
                                        style: "currency",
                                        currency: currency.currencyName,
                                        currencyDisplay: "symbol",
                                      }).format(Number(finalProductPrice))}
                                    </span>
                                    <span className="amount">
                                      {new Intl.NumberFormat("en-US", {
                                        style: "currency",
                                        currency: currency.currencyName,
                                        currencyDisplay: "symbol",
                                      }).format(finalDiscountedPrice)}
                                    </span>
                                  </Fragment>
                                ) : (
                                  <span className="amount">
                                    {new Intl.NumberFormat("en-US", {
                                      style: "currency",
                                      currency: currency.currencyName,
                                      currencyDisplay: "symbol",
                                    }).format(Number(finalProductPrice))}
                                  </span>
                                )}
                              </td>

                              <td className="product-wishlist-cart">
                                {wishlistItem.variation &&
                                wishlistItem.variation.length >= 1 ? (
                                  <Link to={`/product/${wishlistItem.id}`}>
                                    {t(`wish_list.buttons.select_option`)}
                                  </Link>
                                ) : (
                                  <button disabled className="active">
                                    {t(`wish_list.buttons.out_of_stock`)}
                                  </button>
                                )}
                              </td>

                              <td className="product-remove">
                                <button
                                  onClick={() =>
                                    dispatch(
                                      deleteFromWishlist(wishlistItem.id)
                                    )
                                  }
                                >
                                  <i className="fa fa-times"></i>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-12">
                  <div className="cart-shiping-update-wrapper">
                    <div className="cart-shiping-update">
                      <Link to={"/shop"}>
                        {t(`wish_list.buttons.continue_shopping`)}
                      </Link>
                    </div>
                    <div className="cart-clear">
                      <button onClick={() => dispatch(deleteAllFromWishlist())}>
                        {t(`wish_list.buttons.clear_wishlist`)}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Fragment>
          ) : (
            <div className="row">
              <div className="col-lg-12">
                <div className="item-empty-area text-center">
                  <div className="item-empty-area__icon mb-30">
                    <i className="pe-7s-like"></i>
                  </div>
                  <div className="item-empty-area__text">
                    {t(`wish_list.no_items_found`)}
                    <br />{" "}
                    <Link to={"/shop"}>{t(`wish_list.buttons.add_items`)}</Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Wishlist;

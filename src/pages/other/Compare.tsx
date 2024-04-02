import { useDocumentTitle } from "@refinedev/react-router-v6";
import { Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Rating from "../../components/product/sub-components/ProductRating";
import { getDiscountPrice } from "../../helpers/product";
import { deleteFromCompare } from "../../redux/slices/compare-slice";
import { RootState } from "../../redux/store";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { CurrencyFormatter } from "../../helpers/currency";
import { motion } from "framer-motion";
import { CHILDREN_VARIANT, PARENT_VARIANT } from "../../constants/motions";
import { Rate } from "antd";

const Compare = () => {
  const { t } = useTranslation();

  const setTitle = useDocumentTitle();

  useEffect(() => {
    setTitle(t("nav.pages.compare") + " | SUNS");
  }, [t]);

  const dispatch = useDispatch();
  let { pathname } = useLocation();

  const currency = useSelector((state: RootState) => state.currency);
  const { compareItems } = useSelector((state: RootState) => state.compare);

  return (
    <Fragment>
      <Breadcrumb
        pages={[
          { label: "home", path: "/" },
          { label: "pages.compare", path: pathname },
        ]}
      />
      <div className="cart-main-area pt-90 pb-100 bg-white">
        <div className="container">
          {compareItems && compareItems.length >= 1 ? (
            <div className="row">
              <div className="col-lg-12">
                <div className="compare-page-content">
                  <div className="compare-table table-responsive">
                    <motion.table
                      layout
                      style={{ overflow: "hidden" }}
                      className="table table-bordered mb-0"
                    >
                      <motion.tbody
                        layout
                        variants={PARENT_VARIANT}
                        initial="hidden"
                        animate="show"
                        className="container"
                      >
                        <motion.tr>
                          <motion.th layout className="title-column">
                            {t(`compare.title`)}
                          </motion.th>
                          {compareItems.map((compareItem, key) => {
                            return (
                              <motion.td
                                layout
                                variants={CHILDREN_VARIANT}
                                className="product-image-title"
                                key={key}
                              >
                                <div className="compare-remove">
                                  <button
                                    onClick={() =>
                                      dispatch(
                                        deleteFromCompare(compareItem.id)
                                      )
                                    }
                                  >
                                    <i className="pe-7s-trash" />
                                  </button>
                                </div>
                                <Link
                                  to={"/product/" + compareItem.id}
                                  className="image"
                                >
                                  <img
                                    style={{ maxHeight: "250px" }}
                                    className="img-fluid"
                                    src={compareItem.image[0]}
                                    alt=""
                                  />
                                </Link>
                                <div className="product-title">
                                  <Link to={"/product/" + compareItem.id}>
                                    {compareItem.name}
                                  </Link>
                                </div>
                                <div className="compare-btn">
                                  {compareItem.variation &&
                                  compareItem.variation.length >= 1 ? (
                                    <Link to={`/product/${compareItem.id}`}>
                                      {t(`compare.buttons.select_option`)}
                                    </Link>
                                  ) : (
                                    <button disabled className="active">
                                      {t(`compare.buttons.out_of_Stock`)}
                                    </button>
                                  )}
                                </div>
                              </motion.td>
                            );
                          })}
                        </motion.tr>
                        <motion.tr layout>
                          <motion.th layout className="title-column">
                            {t(`compare.items.price`)}
                          </motion.th>
                          {compareItems.map((compareItem, key) => {
                            const discountedPrice = getDiscountPrice(
                              compareItem.price.min,
                              0
                            );
                            const finalProductPrice =
                              (compareItem?.price.min ?? 0) *
                              currency.currencyRate;
                            const finalDiscountedPrice =
                              discountedPrice !== null
                                ? discountedPrice * currency.currencyRate
                                : 0.0;
                            return (
                              <motion.td
                                layout
                                variants={CHILDREN_VARIANT}
                                className="product-price"
                                key={key}
                              >
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
                              </motion.td>
                            );
                          })}
                        </motion.tr>

                        <motion.tr layout>
                          <motion.th layout className="title-column">
                            {t(`compare.items.description`)}
                          </motion.th>
                          {compareItems.map((compareItem, key) => {
                            return (
                              <motion.td
                                layout
                                variants={CHILDREN_VARIANT}
                                className="product-desc"
                                key={key}
                              >
                                <p>
                                  {compareItem.description
                                    ? compareItem.description
                                    : "N/A"}
                                </p>
                              </motion.td>
                            );
                          })}
                        </motion.tr>

                        <motion.tr layout>
                          <motion.th layout className="title-column">
                            {t(`compare.items.rating`)}
                          </motion.th>
                          {compareItems.map((compareItem, key) => {
                            return (
                              <motion.td
                                layout
                                variants={CHILDREN_VARIANT}
                                className="product-rating"
                                key={key}
                              >
                                <Rate
                                  disabled
                                  allowHalf
                                  value={compareItem.averageRating}
                                />
                              </motion.td>
                            );
                          })}
                        </motion.tr>
                      </motion.tbody>
                    </motion.table>
                  </div>
                </div>
              </div>
            </div>
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
                    <i className="pe-7s-shuffle"></i>
                  </div>
                  <div className="item-empty-area__text">
                    {t(`compare.no_items_found`)}
                    <br />{" "}
                    <Link to={"/shop"}> {t(`compare.buttons.add_items`)}</Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>{" "}
    </Fragment>
  );
};

export default Compare;

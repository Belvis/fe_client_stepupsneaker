import { useDocumentTitle } from "@refinedev/react-router-v6";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Rating from "../../components/product/sub-components/ProductRating";
import { getDiscountPrice } from "../../helpers/product";
import { deleteFromCompare } from "../../redux/slices/compare-slice";
import { RootState } from "../../redux/store";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";

const Compare = () => {
  const { t } = useTranslation();

  useDocumentTitle(t("nav.pages.compare") + " | SUNS");

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
      <div className="compare-main-area pt-90 pb-100 bg-white">
        <div className="container">
          {compareItems && compareItems.length >= 1 ? (
            <div className="row">
              <div className="col-lg-12">
                <div className="compare-page-content">
                  <div className="compare-table table-responsive">
                    <table className="table table-bordered mb-0">
                      <tbody>
                        <tr>
                          <th className="title-column">{t(`compare.title`)}</th>
                          {compareItems.map((compareItem, key) => {
                            return (
                              <td className="product-image-title" key={key}>
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
                                    style={{ maxHeight: "400px" }}
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
                              </td>
                            );
                          })}
                        </tr>
                        <tr>
                          <th className="title-column">
                            {t(`compare.items.price`)}
                          </th>
                          {compareItems.map((compareItem, key) => {
                            const discountedPrice = getDiscountPrice(
                              compareItem.price.min,
                              0
                            );
                            const finalProductPrice = (
                              (compareItem?.price.min ?? 0) *
                              currency.currencyRate
                            ).toFixed(2);
                            const finalDiscountedPrice =
                              discountedPrice !== null
                                ? parseFloat(
                                    (
                                      discountedPrice * currency.currencyRate
                                    ).toFixed(2)
                                  )
                                : 0.0;
                            return (
                              <td className="product-price" key={key}>
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
                            );
                          })}
                        </tr>

                        <tr>
                          <th className="title-column">
                            {t(`compare.items.description`)}
                          </th>
                          {compareItems.map((compareItem, key) => {
                            return (
                              <td className="product-desc" key={key}>
                                <p>
                                  {compareItem.description
                                    ? compareItem.description
                                    : "N/A"}
                                </p>
                              </td>
                            );
                          })}
                        </tr>

                        <tr>
                          <th className="title-column">
                            {t(`compare.items.rating`)}
                          </th>
                          {compareItems.map((compareItem, key) => {
                            return (
                              <td className="product-rating" key={key}>
                                <Rating ratingValue={5} />
                              </td>
                            );
                          })}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="row">
              <div className="col-lg-12">
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
              </div>
            </div>
          )}
        </div>
      </div>{" "}
    </Fragment>
  );
};

export default Compare;

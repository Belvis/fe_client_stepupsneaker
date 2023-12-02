import { NumberField } from "@refinedev/antd";
import { Badge } from "antd";
import clsx from "clsx";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getDiscountPrice } from "../../helpers/product";
import { ICartItem, IProductClient } from "../../interfaces";
import { addToCompare } from "../../redux/slices/compare-slice";
import { CurrencyState } from "../../redux/slices/currency-slice";
import { addToWishlist } from "../../redux/slices/wishlist-slice";
import ProductModal from "./ProductModal";
import Rating from "./sub-components/ProductRating";
import { CurrencyFormatter } from "../../helpers/currency";

interface ProductGridListSingleProps {
  product: IProductClient;
  currency: CurrencyState;
  wishlistItem: any;
  compareItem: any;
  spaceBottomClass: string;
}

const ProductGridListSingle: React.FC<ProductGridListSingleProps> = ({
  product,
  currency,
  wishlistItem,
  compareItem,
  spaceBottomClass,
}) => {
  const { t } = useTranslation();

  const [modalShow, setModalShow] = useState(false);
  const discountedPrice = getDiscountPrice(product.price.min, product.discount);
  const finalProductPrice = +(
    product.price.min * currency.currencyRate
  ).toFixed(2);
  const finalDiscountedPrice = +(
    (discountedPrice ?? product.discount) * currency.currencyRate
  ).toFixed(2);
  const dispatch = useDispatch();

  return (
    <Fragment>
      <div className={clsx("product-wrap", spaceBottomClass)}>
        <Badge.Ribbon
          text={`${t("products.sale")} -${product.discount ?? 0}%`}
          color="red"
          placement="start"
          style={{
            zIndex: 2,
            display: product.discount ? "" : "none",
          }}
        >
          <Badge.Ribbon
            text={t("products.new")}
            placement="start"
            color="green"
            style={{
              zIndex: 2,
              marginTop: product.discount ? "30px" : "",
              display: product.new ? "" : "none",
            }}
          >
            <div className="product-img">
              <Link to={"/product/" + product.id}>
                <img className="default-img" src={product.image[0]} alt="" />
                {product.image.length > 1 ? (
                  <img className="hover-img" src={product.image[1]} alt="" />
                ) : (
                  ""
                )}
              </Link>
              <div className="product-action">
                <div className="pro-same-action pro-wishlist">
                  <button
                    className={wishlistItem !== undefined ? "active" : ""}
                    disabled={wishlistItem !== undefined}
                    title={
                      wishlistItem !== undefined
                        ? "Added to wishlist"
                        : "Add to wishlist"
                    }
                    onClick={() => dispatch(addToWishlist(product))}
                  >
                    <i className="pe-7s-like" />
                  </button>
                </div>
                <div className="pro-same-action pro-cart">
                  {product.variation && product.variation.length >= 1 ? (
                    <Link to={`/product/${product.id}`}>Select Option</Link>
                  ) : (
                    <button disabled className="active">
                      Out of Stock
                    </button>
                  )}
                </div>
                <div className="pro-same-action pro-quickview">
                  <button onClick={() => setModalShow(true)} title="Quick View">
                    <i className="pe-7s-look" />
                  </button>
                </div>
              </div>
            </div>
          </Badge.Ribbon>
        </Badge.Ribbon>
        <div className="product-content text-center">
          <h3>
            <Link to={"/product/" + product.id}>{product.name}</Link>
          </h3>
          {/* {product.rating && product.rating > 0 ? ( */}
          <div className="product-rating">
            <Rating ratingValue={5} />
          </div>
          {/* ) : (
            ""
          )} */}
          <div className="product-price">
            {discountedPrice !== null ? (
              <Fragment>
                <CurrencyFormatter
                  value={finalDiscountedPrice}
                  currency={currency}
                />
                <CurrencyFormatter
                  className="old"
                  value={finalProductPrice}
                  currency={currency}
                />
              </Fragment>
            ) : (
              <CurrencyFormatter
                value={finalProductPrice}
                currency={currency}
              />
            )}
          </div>
        </div>
      </div>
      <div className="shop-list-wrap mb-30">
        <div className="row">
          <div className="col-xl-4 col-md-5 col-sm-6">
            <div className="product-list-image-wrap">
              <Badge.Ribbon
                text={`${t("products.sale")} -${product.discount ?? 0}%`}
                color="red"
                placement="start"
                style={{
                  zIndex: 2,
                  display: product.discount ? "" : "none",
                }}
              >
                <Badge.Ribbon
                  text={t("products.new")}
                  placement="start"
                  color="green"
                  style={{
                    zIndex: 2,
                    marginTop: product.discount ? "30px" : "",
                    display: product.new ? "" : "none",
                  }}
                >
                  <div className="product-img">
                    <Link to={"/product/" + product.id}>
                      <img
                        className="default-img img-fluid"
                        src={product.image[0]}
                        alt=""
                      />
                      {product.image.length > 1 ? (
                        <img
                          className="hover-img img-fluid"
                          src={product.image[1]}
                          alt=""
                        />
                      ) : (
                        ""
                      )}
                    </Link>
                  </div>
                </Badge.Ribbon>
              </Badge.Ribbon>
            </div>
          </div>
          <div className="col-xl-8 col-md-7 col-sm-6">
            <div className="shop-list-content">
              <h3>
                <Link to={"/product/" + product.id}>{product.name}</Link>
              </h3>
              <div className="product-list-price">
                {discountedPrice !== null ? (
                  <Fragment>
                    <CurrencyFormatter
                      value={finalDiscountedPrice}
                      currency={currency}
                    />{" "}
                    <CurrencyFormatter
                      className="old"
                      value={finalProductPrice}
                      currency={currency}
                    />
                  </Fragment>
                ) : (
                  <CurrencyFormatter
                    value={finalProductPrice}
                    currency={currency}
                  />
                )}
              </div>
              {/* {product.rating && product.rating > 0 ? ( */}
              <div className="rating-review">
                <div className="product-list-rating">
                  <Rating ratingValue={5} />
                </div>
              </div>
              {/* ) : (
                ""
              )} */}

              {/* Short desc */}
              {/* {product.shortDescription ? (
                <p>{product.shortDescription}</p>
              ) : (
                ""
              )} */}

              <div className="shop-list-actions d-flex align-items-center">
                <div className="shop-list-btn btn-hover">
                  {product.variation && product.variation.length >= 1 ? (
                    <Link to={`/product/${product.id}`}>Select Option</Link>
                  ) : (
                    <button disabled className="active">
                      Out of Stock
                    </button>
                  )}
                </div>

                <div className="shop-list-wishlist ml-10">
                  <button
                    className={wishlistItem !== undefined ? "active" : ""}
                    disabled={wishlistItem !== undefined}
                    title={
                      wishlistItem !== undefined
                        ? "Added to wishlist"
                        : "Add to wishlist"
                    }
                    onClick={() => dispatch(addToWishlist(product))}
                  >
                    <i className="pe-7s-like" />
                  </button>
                </div>
                <div className="shop-list-compare ml-10">
                  <button
                    className={compareItem !== undefined ? "active" : ""}
                    disabled={compareItem !== undefined}
                    title={
                      compareItem !== undefined
                        ? "Added to compare"
                        : "Add to compare"
                    }
                    onClick={() => dispatch(addToCompare(product))}
                  >
                    <i className="pe-7s-shuffle" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* product modal */}
      <ProductModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        product={product}
        currency={currency}
        wishlistItem={wishlistItem}
        compareItem={compareItem}
      />
    </Fragment>
  );
};

export default ProductGridListSingle;

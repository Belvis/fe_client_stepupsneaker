import { NumberField } from "@refinedev/antd";
import clsx from "clsx";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getDiscountPrice } from "../../helpers/product";
import { ICartItem, IProductClient } from "../../interfaces";
import { addToCompare } from "../../redux/slices/compare-slice";
import { addToWishlist } from "../../redux/slices/wishlist-slice";
import ProductModal from "./ProductModal";
import { Badge } from "antd";
import { CurrencyState } from "../../redux/slices/currency-slice";
import { CurrencyFormatter } from "../../helpers/currency";

type ProductGridSingleNineProps = {
  cartItem?: ICartItem;
  compareItem?: IProductClient;
  wishlistItem?: IProductClient;
  currency: CurrencyState;
  product: IProductClient;
  spaceBottomClass?: string;
  colorClass?: string;
};

const ProductGridSingleNine: React.FC<ProductGridSingleNineProps> = ({
  product,
  currency,
  cartItem,
  wishlistItem,
  compareItem,
  spaceBottomClass,
  colorClass,
}) => {
  const { t } = useTranslation();

  const [modalShow, setModalShow] = useState(false);
  const discountedPrice = getDiscountPrice(product.price.max, product.discount);
  const finalProductPrice = +(product.price.max * currency.currencyRate);
  const finalDiscountedPrice = +(
    (discountedPrice ?? product.discount) * currency.currencyRate
  );
  const dispatch = useDispatch();

  return (
    <div style={{ padding: "0 10px 0 10px" }}>
      <Badge.Ribbon
        text={`${t("products.sale")} -${product.discount ?? 0}%`}
        color="red"
        placement="start"
        style={{
          zIndex: 5,
          display: product.discount ? "" : "none",
        }}
      >
        <div className={clsx("product-wrap-9", spaceBottomClass, colorClass)}>
          <div className="product-img">
            <Link to={"/product/" + product.id}>
              <img className="default-img" src={product.image[0]} alt="" />
              {product.image.length > 1 ? (
                <img className="hover-img" src={product.image[1]} alt="" />
              ) : (
                ""
              )}
            </Link>
            {/* Promotion */}
            {product.discount || product.new ? (
              <div className="product-img-badges">
                {product.new ? (
                  <span className="primary" style={{ textAlign: "end" }}>
                    {t(`products.new`)}
                  </span>
                ) : (
                  ""
                )}
              </div>
            ) : (
              ""
            )}

            <div className="product-action-2">
              {product.variation && product.variation.length >= 1 ? (
                <Link to={`/product/${product.id}`} title="Select options">
                  <i className="fa fa-cog"></i>
                </Link>
              ) : (
                <button disabled className="active" title="Out of stock">
                  <i className="fa fa-shopping-cart"></i>
                </button>
              )}

              <button onClick={() => setModalShow(true)} title="Quick View">
                <i className="fa fa-eye"></i>
              </button>

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
                <i className="fa fa-retweet"></i>
              </button>
            </div>
          </div>
          <div className="product-content-2">
            <div className="title-price-wrap-2">
              <h3>
                <Link to={"/product/" + product.id}>{product.name}</Link>
              </h3>
              <div className="price-2">
                {discountedPrice !== null ? (
                  <Fragment>
                    <CurrencyFormatter
                      value={finalProductPrice}
                      currency={currency}
                    />{" "}
                    <CurrencyFormatter
                      className="old"
                      value={finalDiscountedPrice}
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
            <div className="pro-wishlist-2">
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
                <i className="fa fa-heart-o" />
              </button>
            </div>
          </div>
        </div>
      </Badge.Ribbon>

      <ProductModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        product={product}
        currency={currency}
        wishlistItem={wishlistItem}
        compareItem={compareItem}
      />
    </div>
  );
};

export default ProductGridSingleNine;

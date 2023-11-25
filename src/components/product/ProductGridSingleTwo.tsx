import clsx from "clsx";
import { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getDiscountPrice } from "../../helpers/product";
import { ICartItem, IProductClient } from "../../interfaces";
import { addToCompare } from "../../redux/slices/compare-slice";
import { CurrencyState } from "../../redux/slices/currency-slice";
import { addToWishlist } from "../../redux/slices/wishlist-slice";
import ProductModal from "./ProductModal";
import Rating from "./sub-components/ProductRating";

type ProductGridSingleTwoProps = {
  cartItem?: ICartItem;
  compareItem?: IProductClient;
  wishlistItem?: IProductClient;
  currency: CurrencyState;
  product: IProductClient;
  spaceBottomClass?: string;
  colorClass?: string;
};

const ProductGridSingleTwo: React.FC<ProductGridSingleTwoProps> = ({
  product,
  currency,
  cartItem,
  wishlistItem,
  compareItem,
  spaceBottomClass,
  colorClass,
}) => {
  const [modalShow, setModalShow] = useState(false);
  const discountedPrice = getDiscountPrice(product.price.max, product.discount);
  const finalProductPrice = +(
    product.price.max * currency.currencyRate
  ).toFixed(2);
  const finalDiscountedPrice = +(
    (discountedPrice ?? product.discount) * currency.currencyRate
  ).toFixed(2);
  const dispatch = useDispatch();

  return (
    <Fragment>
      <div className={clsx("product-wrap-8", spaceBottomClass, colorClass)}>
        <div className="product-img">
          <Link to={"/product/" + product.id}>
            <img
              className="default-img img-fluid"
              src={product.image[0]}
              alt=""
            />
          </Link>
          {/* Promotion */}
          {product.discount || product.new ? (
            <div className="product-img-badges">
              {product.discount ? (
                <span className="pink">-{product.discount}%</span>
              ) : (
                ""
              )}
              {product.new ? <span className="purple">New</span> : ""}
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="product-content">
          <h3>
            <Link to={product.id}>{product.name}</Link>
          </h3>

          <div className="product-price">
            {discountedPrice !== null ? (
              <Fragment>
                <span className="old">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: currency.currencyName,
                    currencyDisplay: "symbol",
                  }).format(finalProductPrice)}
                </span>{" "}
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: currency.currencyName,
                  currencyDisplay: "symbol",
                }).format(finalDiscountedPrice)}
              </Fragment>
            ) : (
              <span>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: currency.currencyName,
                  currencyDisplay: "symbol",
                }).format(finalProductPrice)}
              </span>
            )}
          </div>

          {/* {product.rating && product.rating > 0 ? ( */}
          <div className="product-rating">
            <Rating ratingValue={5} />
          </div>
          {/* ) : (
            ""
          )} */}

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
                <Link to={`/product/${product.id}`} title="Select option">
                  <i className="pe-7s-cart"></i>
                </Link>
              ) : (
                <button disabled className="active" title="Out of stock">
                  <i className="pe-7s-cart"></i>
                </button>
              )}
            </div>
            <div className="pro-same-action pro-compare">
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

export default ProductGridSingleTwo;

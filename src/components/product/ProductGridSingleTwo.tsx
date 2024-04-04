import { Rate } from "antd";
import clsx from "clsx";
import { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { CurrencyFormatter } from "../../helpers/currency";
import { getDiscountPrice } from "../../helpers/product";
import { ICartItem, IProductClient } from "../../interfaces";
import { addToCompare } from "../../redux/slices/compare-slice";
import { CurrencyState } from "../../redux/slices/currency-slice";
import { addToWishlist } from "../../redux/slices/wishlist-slice";
import ProductModal from "./ProductModal";
import { useTranslate } from "@refinedev/core";

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
  const t = useTranslate();
  const [modalShow, setModalShow] = useState(false);
  const discountedPrice = getDiscountPrice(product.price.max, product.discount);
  const finalProductPrice = +(product.price.max * currency.currencyRate);
  const finalDiscountedPrice = +(
    (discountedPrice ?? product.discount) * currency.currencyRate
  );
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
              {product.new ? (
                <span className="purple">{t("products.new")}</span>
              ) : (
                ""
              )}
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
                <CurrencyFormatter
                  value={finalDiscountedPrice}
                  currency={currency}
                  notation="compact"
                />{" "}
                <CurrencyFormatter
                  className="old"
                  value={finalProductPrice}
                  currency={currency}
                  notation="compact"
                />
              </Fragment>
            ) : (
              <CurrencyFormatter
                value={finalProductPrice}
                currency={currency}
                notation="compact"
              />
            )}
          </div>

          {product.averageRating >= 0 && (
            <div className="product-rating">
              <Rate disabled allowHalf value={product.averageRating} />
            </div>
          )}

          <div className="product-action">
            <div className="pro-same-action pro-wishlist">
              <button
                className={wishlistItem !== undefined ? "active" : ""}
                disabled={wishlistItem !== undefined}
                title={
                  wishlistItem !== undefined
                    ? t("product_action.tooltips.wishlist.in")
                    : t("product_action.tooltips.wishlist.out")
                }
                onClick={() => dispatch(addToWishlist(product))}
              >
                <i className="pe-7s-like" />
              </button>
            </div>
            <div className="pro-same-action pro-cart">
              {product.variation && product.variation.length >= 1 ? (
                <Link
                  to={`/product/${product.id}`}
                  title={t("products.buttons.shop_now")}
                >
                  <i className="pe-7s-cart"></i>
                </Link>
              ) : (
                <button
                  disabled
                  className="active"
                  title={t("products.desc_tab.buttons.out_of_stock")}
                >
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
                    ? t("product_action.tooltips.compare.in")
                    : t("product_action.tooltips.compare.out")
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

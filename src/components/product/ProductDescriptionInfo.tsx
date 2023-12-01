import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  getDiscountPrice,
  getProductCartQuantity,
} from "../../helpers/product";
import {
  ICartItem,
  IColorResponse,
  IProductClient,
  ISizeClient,
  IVariation,
} from "../../interfaces";
import { addToCart } from "../../redux/slices/cart-slice";
import { addToCompare } from "../../redux/slices/compare-slice";
import { CurrencyState } from "../../redux/slices/currency-slice";
import { addToWishlist } from "../../redux/slices/wishlist-slice";
import Rating from "./sub-components/ProductRating";
import { Badge, Space } from "antd";
import { SaleIcon } from "../icons/icon-sale";
import { useTranslation } from "react-i18next";

interface ProductDescriptionInfoProps {
  product: IProductClient;
  currency: CurrencyState;
  cartItems: ICartItem[];
  wishlistItem: IProductClient | undefined;
  compareItem: IProductClient | undefined;
  selectedProductColor: IColorResponse;
  setSelectedProductColor: Dispatch<SetStateAction<IColorResponse>>;
  selectedVariant: IVariation;
}

const ProductDescriptionInfo: React.FC<ProductDescriptionInfoProps> = ({
  product,
  currency,
  cartItems,
  wishlistItem,
  compareItem,
  selectedProductColor,
  setSelectedProductColor,
  selectedVariant,
}) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const initialSelectedSize =
    product.variation && product.variation.length > 0
      ? product.variation[0].size[0]
      : ({} as ISizeClient);
  const initialProductStock =
    product.variation && product.variation.length > 0
      ? product.variation[0].size[0].stock
      : 0;

  const [selectedProductSize, setSelectedProductSize] =
    useState(initialSelectedSize);

  const [productStock, setProductStock] = useState(initialProductStock);

  const [quantityCount, setQuantityCount] = useState(1);

  const productCartQty = getProductCartQuantity(
    cartItems,
    product,
    selectedProductColor,
    selectedProductSize
  );

  const discountedPrice = getDiscountPrice(
    selectedProductSize.price,
    selectedProductSize.discount
  );
  const finalProductPrice = +(
    selectedProductSize.price * currency.currencyRate
  ).toFixed(2);
  const finalDiscountedPrice = +(
    (discountedPrice ?? selectedProductSize.discount) * currency.currencyRate
  ).toFixed(2);

  useEffect(() => {
    setSelectedProductSize(initialSelectedSize);
    setProductStock(initialProductStock);
  }, []);

  return (
    <div className="product-details-content ml-70">
      <h2>{product.name}</h2>
      <div className="product-details-price">
        {discountedPrice !== null ? (
          <Fragment>
            <span>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: currency.currencyName,
                currencyDisplay: "symbol",
              }).format(finalDiscountedPrice)}
            </span>{" "}
            <span className="old">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: currency.currencyName,
                currencyDisplay: "symbol",
              }).format(finalProductPrice)}
            </span>
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
      <div className="pro-details-rating-wrap">
        <div className="pro-details-rating">
          <Rating ratingValue={5} />
        </div>
      </div>
      {/* ) : (
        ""
      )} */}
      <div className="pro-details-list">
        <p>
          Bước chân vào phong cách đương đại với đôi sneaker này - sự kết hợp
          hoàn hảo giữa thiết kế hiện đại và thoải mái vô song. Với đế đàn hồi,
          chất liệu chống nước và đường may tỉ mỉ, đôi sneaker này không chỉ là
          một phần của bộ sưu tập thời trang của bạn mà còn là người bạn đồng
          hành lý tưởng trong mọi hoạt động hàng ngày. Bước chân nhẹ nhàng, hãy
          để đôi sneaker này làm nổi bật phong cách cá nhân của bạn.
        </p>
      </div>

      {product.variation ? (
        <div className="pro-details-size-color">
          <div className="pro-details-color-wrap">
            <Space direction="vertical" size="middle">
              <span>{t(`products.fields.colors`)}</span>
              <div className="pro-details-color-content">
                {product.variation.map((single, key) => {
                  const hasSale = single.size.some(
                    (size) =>
                      typeof size.discount === "number" && size.discount > 0
                  );

                  return (
                    <label
                      className={`pro-details-color-content--single ${
                        single.color
                      } ${
                        single.color.id === selectedProductColor.id
                          ? "selected"
                          : ""
                      }`}
                      key={key}
                      style={{
                        background: `#${single.color.code}`,
                        border: "2px solid white",
                        outline: "transparent solid 2px ",
                      }}
                    >
                      <Badge
                        offset={[20, 0]}
                        count={
                          hasSale ? (
                            <SaleIcon
                              style={{
                                color: "red",
                                fontSize: "24px",
                                zIndex: 2,
                              }}
                            />
                          ) : (
                            0
                          )
                        }
                      >
                        <input
                          type="radio"
                          value={single.color.id}
                          name="product-color"
                          checked={single.color.id === selectedProductColor.id}
                          onChange={() => {
                            setSelectedProductColor(single.color);
                            setSelectedProductSize(single.size[0]);
                            setProductStock(single.size[0].stock);
                            setQuantityCount(1);
                          }}
                        />
                      </Badge>
                    </label>
                  );
                })}
              </div>
            </Space>
          </div>
          <div className="pro-details-size">
            <Space direction="vertical" size="middle">
              <span>{t(`products.fields.sizes`)}</span>
              <div className="pro-details-size-content">
                {product.variation &&
                  product.variation.map((single) => {
                    return single.color.id === selectedProductColor.id
                      ? single.size.map((singleSize, key) => {
                          const hasSale = singleSize.discount > 0;

                          return (
                            <label
                              className={`pro-details-size-content--single`}
                              key={key}
                            >
                              <Badge
                                count={
                                  hasSale ? (
                                    <SaleIcon
                                      style={{
                                        color: "red",
                                        fontSize: "24px",
                                        zIndex: 2,
                                      }}
                                    />
                                  ) : (
                                    0
                                  )
                                }
                              >
                                <input
                                  type="radio"
                                  value={singleSize.name}
                                  checked={
                                    singleSize.id === selectedProductSize.id
                                  }
                                  onChange={() => {
                                    setSelectedProductSize(singleSize);
                                    setProductStock(singleSize.stock);
                                    setQuantityCount(1);
                                  }}
                                />
                                <span className="size-name">
                                  {singleSize.name}
                                </span>
                              </Badge>
                            </label>
                          );
                        })
                      : "";
                  })}
              </div>
            </Space>
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="pro-details-quality">
        <div className="cart-plus-minus">
          <button
            onClick={() =>
              setQuantityCount(quantityCount > 1 ? quantityCount - 1 : 1)
            }
            className="dec qtybutton"
          >
            -
          </button>
          <input
            className="cart-plus-minus-box"
            type="text"
            value={quantityCount}
            readOnly
          />
          <button
            onClick={() =>
              setQuantityCount(
                quantityCount < productStock - productCartQty
                  ? quantityCount + 1
                  : quantityCount
              )
            }
            className="inc qtybutton"
          >
            +
          </button>
        </div>
        <div className="pro-details-cart btn-hover">
          {productStock && productStock > 0 ? (
            <button
              onClick={() =>
                dispatch(
                  addToCart({
                    id: "",
                    cartItemId: product.id,
                    quantity: quantityCount,
                    image: selectedVariant.image[0],
                    name: product.name,
                    selectedProductColor: selectedProductColor,
                    selectedProductSize: selectedProductSize,
                  })
                )
              }
              disabled={productCartQty >= productStock}
            >
              {t(`products.buttons.add_to_cart`)}
            </button>
          ) : (
            <button disabled>{t(`products.buttons.out_of_stock`)}</button>
          )}
        </div>
        <div className="pro-details-wishlist">
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
        <div className="pro-details-compare">
          <button
            className={compareItem !== undefined ? "active" : ""}
            disabled={compareItem !== undefined}
            title={
              compareItem !== undefined ? "Added to compare" : "Add to compare"
            }
            onClick={() => dispatch(addToCompare(product))}
          >
            <i className="pe-7s-shuffle" />
          </button>
        </div>
      </div>
      {/* {product.category ? ( */}
      <div className="pro-details-meta">
        <span>{t(`products.fields.styles`)} :</span>
        <ul>
          {["Kiểu dáng 1", "Kiểu dáng 2"].map((single, key) => {
            return (
              <li key={key}>
                <Link to={"/shop"}>{single}</Link>
              </li>
            );
          })}
        </ul>
      </div>
      {/* ) : (
        ""
      )} */}
      {/* {product.tag ? ( */}
      <div className="pro-details-meta">
        <span>{t(`products.fields.tags`)} :</span>
        <ul>
          {["Tag 1, Tag 2"].map((single, key) => {
            return (
              <li key={key}>
                <Link to={"/shop"}>{single}</Link>
              </li>
            );
          })}
        </ul>
      </div>
      {/* ) : (
        ""
      )} */}

      <div className="pro-details-social">
        <ul>
          <li>
            <a href="//facebook.com">
              <i className="fa fa-facebook" />
            </a>
          </li>
          <li>
            <a href="//dribbble.com">
              <i className="fa fa-dribbble" />
            </a>
          </li>
          <li>
            <a href="//pinterest.com">
              <i className="fa fa-pinterest-p" />
            </a>
          </li>
          <li>
            <a href="//twitter.com">
              <i className="fa fa-twitter" />
            </a>
          </li>
          <li>
            <a href="//linkedin.com">
              <i className="fa fa-linkedin" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProductDescriptionInfo;

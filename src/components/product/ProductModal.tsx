import { Authenticated } from "@refinedev/core";
import { Badge, Rate, Space, Tooltip } from "antd";
import { Fragment, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { EffectFade, Thumbs } from "swiper";
import { CurrencyFormatter } from "../../helpers/currency";
import {
  getDiscountPrice,
  getProductCartQuantity,
  getTotalCartQuantity,
} from "../../helpers/product";
import { IColorResponse, IProductClient, ISizeClient } from "../../interfaces";
import { addToCart, addToDB } from "../../redux/slices/cart-slice";
import { addToCompare } from "../../redux/slices/compare-slice";
import { addToWishlist } from "../../redux/slices/wishlist-slice";
import { AppDispatch, RootState } from "../../redux/store";
import { SaleIcon } from "../icons/icon-sale";
import Swiper, { SwiperSlide } from "../swiper";
import Rating from "./sub-components/ProductRating";
import { showErrorToast } from "../../helpers/toast";
import { useNavigate } from "react-router-dom";

type ProductModalProps = {
  currency: any;
  show: boolean;
  onHide: () => void;
  product: IProductClient;
  wishlistItem: any;
  compareItem: any;
};

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  currency,
  show,
  onHide,
  wishlistItem,
  compareItem,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const dispatch: AppDispatch = useDispatch();
  const { cartItems } = useSelector((state: RootState) => state.cart);

  const initialSelectedColor =
    product.variation && product.variation.length > 0
      ? product.variation[0].color
      : ({} as IColorResponse);
  const initialSelectedSize =
    product.variation && product.variation.length > 0
      ? product.variation[0].size[0]
      : ({} as ISizeClient);
  const initialProductStock =
    product.variation && product.variation.length > 0
      ? product.variation[0].size[0].stock
      : 0;

  const [selectedProductColor, setSelectedProductColor] =
    useState(initialSelectedColor);

  const [selectedProductSize, setSelectedProductSize] =
    useState(initialSelectedSize);

  const [selectedVariant, setSelectedVariant] = useState(product.variation[0]);

  const [productStock, setProductStock] = useState(initialProductStock);

  const [quantityCount, setQuantityCount] = useState(1);
  const productCartQty = getProductCartQuantity(
    cartItems,
    product,
    selectedProductColor,
    selectedProductSize
  );
  const totalCartQty = getTotalCartQuantity(cartItems);
  const discountedPrice = getDiscountPrice(
    selectedProductSize.price,
    selectedProductSize.discount
  );
  const finalProductPrice = +(
    selectedProductSize.price * currency.currencyRate
  );
  const finalDiscountedPrice = +(
    (discountedPrice ?? selectedProductSize.discount) * currency.currencyRate
  );

  useEffect(() => {
    const selectedVariant = product.variation.find(
      (variation) => variation.color.id === selectedProductColor.id
    );
    if (selectedVariant) setSelectedVariant(selectedVariant);
  }, [selectedProductColor]);

  useEffect(() => {
    setSelectedProductColor(initialSelectedColor);
    setSelectedProductSize(initialSelectedSize);
    setProductStock(initialProductStock);
  }, []);

  const gallerySwiperParams = {
    spaceBetween: 10,
    loop: true,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    thumbs: {
      swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
    },
    modules: [EffectFade, Thumbs],
  };

  const thumbnailSwiperParams = {
    onSwiper: setThumbsSwiper,
    spaceBetween: 10,
    slidesPerView: 4,
    touchRatio: 0.2,
    freeMode: true,
    loop: true,
    slideToClickedSlide: true,
    navigation: true,
  };

  const onCloseModal = () => {
    setThumbsSwiper(null);
    onHide();
  };

  const isButtonDisabled =
    productCartQty >= productStock ||
    quantityCount + productCartQty > 5 ||
    totalCartQty >= 5;

  const handleDispatchAddToCart = () => {
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
    );
  };

  const handleDispatchAddToDB = () => {
    return new Promise<void>((resolve, reject) => {
      dispatch(
        addToDB({
          id: "",
          cartItemId: product.id,
          quantity: quantityCount,
          image: selectedVariant.image[0],
          name: product.name,
          selectedProductColor: selectedProductColor,
          selectedProductSize: selectedProductSize,
        })
      )
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const handleDBShopNowButtonClick = async () => {
    try {
      await handleDispatchAddToDB();
      navigate("/pages/checkout");
    } catch (error) {
      console.error("Error adding to DB:", error);
    }
  };

  const handleShopNowButtonClick = () => {
    handleDispatchAddToCart();
    navigate("/pages/checkout");
  };

  return (
    <Modal
      show={show}
      onHide={onCloseModal}
      className="product-quickview-modal-wrapper"
    >
      <Modal.Header closeButton></Modal.Header>

      <div className="modal-body">
        <div className="row">
          <div className="col-md-5 col-sm-12 col-xs-12">
            <div className="product-large-image-wrapper">
              <Swiper options={gallerySwiperParams}>
                {selectedVariant &&
                  selectedVariant.image &&
                  selectedVariant.image.length > 0 &&
                  selectedVariant.image.map((img, i) => {
                    return (
                      <SwiperSlide key={i}>
                        <div className="single-image">
                          <img src={img} className="img-fluid" alt="Product" />
                        </div>
                      </SwiperSlide>
                    );
                  })}
              </Swiper>
            </div>
            <div className="product-small-image-wrapper mt-15">
              <Swiper options={thumbnailSwiperParams}>
                {selectedVariant &&
                  selectedVariant.image &&
                  selectedVariant.image.map((image, i) => {
                    return (
                      <SwiperSlide key={i}>
                        <div className="single-image">
                          <img src={image} className="img-fluid" alt="" />
                        </div>
                      </SwiperSlide>
                    );
                  })}
              </Swiper>
            </div>
          </div>
          <div className="col-md-7 col-sm-12 col-xs-12">
            <div className="product-details-content quickview-content">
              <h2>{product.name}</h2>
              <div className="product-details-price">
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
              {product.averageRating >= 0 && (
                <div className="pro-details-rating-wrap">
                  <div className="pro-details-rating">
                    <Rate disabled allowHalf value={product.averageRating} />
                  </div>
                </div>
              )}
              <div className="pro-details-list">
                <p>{product.description}</p>
              </div>
              {product.variation ? (
                <div className="pro-details-size-color">
                  <div className="pro-details-color-wrap">
                    <Space direction="vertical">
                      <span>Màu sắc</span>
                      <div className="pro-details-color-content">
                        {product.variation.map((single, key) => {
                          const hasSale = single.size.some(
                            (size) =>
                              typeof size.discount === "number" &&
                              size.discount > 0
                          );

                          return (
                            <label
                              className={`pro-details-color-content--single ${
                                single.color.id
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
                                  checked={
                                    single.color.id === selectedProductColor.id
                                  }
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
                    <Space direction="vertical">
                      <span>Kích cỡ</span>
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
                                          value={singleSize.id}
                                          checked={
                                            singleSize.id ===
                                            selectedProductSize.id
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
                    onClick={() => {
                      if (quantityCount <= 1) {
                        return showErrorToast("Đã đạt số lượng nhỏ nhất");
                      }
                      setQuantityCount(quantityCount - 1);
                    }}
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
                    onClick={() => {
                      if (
                        quantityCount + productCartQty >= 5 ||
                        totalCartQty >= 5
                      ) {
                        return showErrorToast(
                          "Bạn chỉ có thể mua tối da 5 sản phẩm, vui lòng liên hệ với chúng tôi nếu có nhu cầu mua số lượng lớn"
                        );
                      }

                      if (quantityCount >= productStock - productCartQty) {
                        return showErrorToast(
                          "Rất tiếc, đã đạt giới hạn số lượng sản phẩm!"
                        );
                      }
                      setQuantityCount(quantityCount + 1);
                    }}
                    className="inc qtybutton"
                  >
                    +
                  </button>
                </div>
                <div className="pro-details-stock">
                  <span className="fw-bold">{productStock}</span>
                  <span>Sản phẩm có sẵn</span>
                </div>
              </div>
              <div className="pro-details-quality">
                <div className="pro-details-cart btn-hover">
                  {productStock && productStock > 0 ? (
                    <Authenticated
                      fallback={
                        <Tooltip
                          title={
                            isButtonDisabled
                              ? "Bạn chỉ có thể mua tối đa 5 sản phẩm, vui lòng liên hệ với chúng tôi nếu có nhu cầu mua số lượng lớn"
                              : productCartQty >= productStock
                              ? "Rất tiếc, đã đạt giới hạn số lượng sản phẩm"
                              : ""
                          }
                        >
                          <button
                            className="mw-250 button-white"
                            onClick={handleDispatchAddToCart}
                            disabled={isButtonDisabled}
                          >
                            {t(`products.buttons.add_to_cart`)}
                          </button>
                        </Tooltip>
                      }
                    >
                      <Tooltip
                        title={
                          isButtonDisabled
                            ? "Bạn chỉ có thể mua tối đa 5 sản phẩm, vui lòng liên hệ với chúng tôi nếu có nhu cầu mua số lượng lớn"
                            : productCartQty >= productStock
                            ? "Rất tiếc, đã đạt giới hạn số lượng sản phẩm"
                            : ""
                        }
                      >
                        <button
                          className="mw-250 button-white"
                          onClick={handleDispatchAddToDB}
                          disabled={isButtonDisabled}
                        >
                          {t(`products.buttons.add_to_cart`)}
                        </button>
                      </Tooltip>
                    </Authenticated>
                  ) : (
                    <button className="mw-250 button-white" disabled>
                      {t(`products.desc_tab.buttons.out_of_stock`)}
                    </button>
                  )}
                </div>
                {productStock > 0 && (
                  <div className="pro-details-cart btn-hover">
                    <Authenticated
                      fallback={
                        <Tooltip
                          title={
                            isButtonDisabled
                              ? "Bạn chỉ có thể mua tối đa 5 sản phẩm, vui lòng liên hệ với chúng tôi nếu có nhu cầu mua số lượng lớn"
                              : productCartQty >= productStock
                              ? "Rất tiếc, đã đạt giới hạn số lượng sản phẩm"
                              : ""
                          }
                        >
                          <button
                            className="button-black"
                            onClick={handleShopNowButtonClick}
                            disabled={isButtonDisabled}
                          >
                            Mua ngay
                          </button>
                        </Tooltip>
                      }
                    >
                      <Tooltip
                        title={
                          isButtonDisabled
                            ? "Bạn chỉ có thể mua tối đa 5 sản phẩm, vui lòng liên hệ với chúng tôi nếu có nhu cầu mua số lượng lớn"
                            : productCartQty >= productStock
                            ? "Rất tiếc, đã đạt giới hạn số lượng sản phẩm"
                            : ""
                        }
                      >
                        <button
                          className="button-black"
                          onClick={handleDBShopNowButtonClick}
                          disabled={isButtonDisabled}
                        >
                          Mua ngay
                        </button>
                      </Tooltip>
                    </Authenticated>
                  </div>
                )}
                <div className="pro-details-wishlist">
                  <button
                    className={wishlistItem !== undefined ? "active" : ""}
                    disabled={wishlistItem !== undefined}
                    title={
                      wishlistItem !== undefined
                        ? "Đã thêm vào danh sách yêu thích"
                        : "Thêm vào danh sách yêu thích"
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
                      compareItem !== undefined
                        ? "Đã thêm vào danh sách so sánh"
                        : "Thêm vào danh sách so sánh"
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
    </Modal>
  );
};

export default ProductModal;

import { Rate } from "antd";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { EffectFade, Thumbs } from "swiper";
import {
  getProductCartQuantity,
  getTotalCartQuantity,
} from "../../helpers/product";
import { IColorResponse, IProductClient, ISizeClient } from "../../interfaces";
import { RootState } from "../../redux/store";
import Swiper, { SwiperSlide } from "../swiper";
import ProductDetailsButtons from "./sub-components/ProductDetailsButtons";
import ProductDetailsPrice from "./sub-components/ProductDetailsPrice";
import ProductQuantityControl from "./sub-components/ProductQuantityControl";
import ProductVariations from "./sub-components/ProductVariations";

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
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
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
                  selectedVariant.image.sort().map((img, i) => {
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
                  selectedVariant.image.sort().map((image, i) => {
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
                <ProductDetailsPrice
                  currency={currency}
                  selectedProductSize={selectedProductSize}
                />
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
              {product.variation && (
                <ProductVariations
                  selectedProductSize={selectedProductSize}
                  selectedProductColor={selectedProductColor}
                  product={product}
                  setSelectedProductSize={setSelectedProductSize}
                  setSelectedProductColor={setSelectedProductColor}
                  setProductStock={setProductStock}
                  setQuantityCount={setQuantityCount}
                />
              )}
              <ProductQuantityControl
                quantityCount={quantityCount}
                productCartQty={productCartQty}
                totalCartQty={totalCartQty}
                productStock={productStock}
                setQuantityCount={setQuantityCount}
              />
              <ProductDetailsButtons
                productStock={productStock}
                productCartQty={productCartQty}
                quantityCount={quantityCount}
                totalCartQty={totalCartQty}
                product={product}
                compareItem={compareItem}
                wishlistItem={wishlistItem}
                selectedVariant={selectedVariant}
                selectedProductColor={selectedProductColor}
                selectedProductSize={selectedProductSize}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProductModal;

import { Rate } from "antd";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getProductCartQuantity,
  getTotalCartQuantity,
} from "../../helpers/product";
import {
  ICartItem,
  IColorResponse,
  IProductClient,
  ISizeClient,
  IVariation,
} from "../../interfaces";
import { CurrencyState } from "../../redux/slices/currency-slice";
import ProductDetailsButtons from "./sub-components/ProductDetailsButtons";
import ProductDetailsPrice from "./sub-components/ProductDetailsPrice";
import ProductQuantityControl from "./sub-components/ProductQuantityControl";
import ProductVariations from "./sub-components/ProductVariations";

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

  const totalCartQty = getTotalCartQuantity(cartItems);

  useEffect(() => {
    setSelectedProductSize(initialSelectedSize);
    setProductStock(initialProductStock);
  }, []);

  return (
    <div className="product-details-content ml-70">
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
        <p>
          Bước chân vào phong cách đương đại với đôi sneaker này - sự kết hợp
          hoàn hảo giữa thiết kế hiện đại và thoải mái vô song. Với đế đàn hồi,
          chất liệu chống nước và đường may tỉ mỉ, đôi sneaker này không chỉ là
          một phần của bộ sưu tập thời trang của bạn mà còn là người bạn đồng
          hành lý tưởng trong mọi hoạt động hàng ngày. Bước chân nhẹ nhàng, hãy
          để đôi sneaker này làm nổi bật phong cách cá nhân của bạn.
        </p>
      </div>
      <div className="pro-details-meta">
        <span>{t("products.fields.code")} :</span>
        <span className="fw-bold">{product.code}</span>
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

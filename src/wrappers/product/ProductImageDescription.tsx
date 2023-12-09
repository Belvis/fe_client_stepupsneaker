import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import ProductImageGallery from "../../components/product/ProductImageGallery";
import ProductDescriptionInfo from "../../components/product/ProductDescriptionInfo";
import ProductImageGallerySideThumb from "../../components/product/ProductImageGallerySideThumb";
import ProductImageFixed from "../../components/product/ProductImageFixed";
import { IColorResponse, IProductClient } from "../../interfaces";
import { AppDispatch, RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { useIsAuthenticated } from "@refinedev/core";
import { fetchCart } from "../../redux/slices/cart-slice";

interface ProductImageDescriptionProps {
  spaceTopClass: string;
  spaceBottomClass: string;
  galleryType: string;
  product: IProductClient;
}

const ProductImageDescription: React.FC<ProductImageDescriptionProps> = ({
  spaceTopClass,
  spaceBottomClass,
  galleryType,
  product,
}) => {
  const currency = useSelector((state: RootState) => state.currency);
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const { wishlistItems } = useSelector((state: RootState) => state.wishlist);
  const { compareItems } = useSelector((state: RootState) => state.compare);
  const wishlistItem = wishlistItems.find((item) => item.id === product.id);
  const compareItem = compareItems.find((item) => item.id === product.id);

  const initialSelectedColor =
    product.variation && product.variation.length > 0
      ? product.variation[0].color
      : ({} as IColorResponse);

  const [selectedProductColor, setSelectedProductColor] =
    useState(initialSelectedColor);

  const [selectedVariant, setSelectedVariant] = useState(product.variation[0]);

  useEffect(() => {
    setSelectedProductColor(initialSelectedColor);
  }, []);

  useEffect(() => {
    const selectedVariant = product.variation.find(
      (variation) => variation.color.id === selectedProductColor.id
    );
    if (selectedVariant) setSelectedVariant(selectedVariant);
  }, [selectedProductColor]);

  return (
    <div
      className={clsx("shop-area", spaceTopClass, spaceBottomClass, "bg-white")}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-6">
            {/* product image gallery */}
            {galleryType === "leftThumb" ? (
              <ProductImageGallerySideThumb
                product={product}
                thumbPosition="left"
                selectedVariant={selectedVariant}
              />
            ) : galleryType === "rightThumb" ? (
              <ProductImageGallerySideThumb
                product={product}
                selectedVariant={selectedVariant}
              />
            ) : galleryType === "fixedImage" ? (
              <ProductImageFixed product={product} />
            ) : (
              <ProductImageGallery product={product} />
            )}
          </div>
          <div className="col-lg-6 col-md-6">
            {/* product description info */}
            <ProductDescriptionInfo
              product={product}
              currency={currency}
              cartItems={cartItems}
              wishlistItem={wishlistItem}
              compareItem={compareItem}
              selectedProductColor={selectedProductColor}
              setSelectedProductColor={setSelectedProductColor}
              selectedVariant={selectedVariant}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductImageDescription;

import { Authenticated, useTranslate } from "@refinedev/core";
import { Tooltip } from "antd";
import { FC, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../../redux/store";
import { useDispatch } from "react-redux";
import {
  IColorResponse,
  IProductClient,
  ISizeClient,
  IVariation,
} from "../../../interfaces";
import { addToWishlist } from "../../../redux/slices/wishlist-slice";
import { addToCompare } from "../../../redux/slices/compare-slice";
import { addToCart, addToDB } from "../../../redux/slices/cart-slice";

interface ProductDetailsButtonsProps {
  productStock: number;
  productCartQty: number;
  quantityCount: number;
  totalCartQty: number;
  product: IProductClient;
  compareItem: IProductClient | undefined;
  wishlistItem: IProductClient | undefined;
  selectedVariant: IVariation;
  selectedProductColor: IColorResponse;
  selectedProductSize: ISizeClient;
}

const ProductDetailsButtons: FC<ProductDetailsButtonsProps> = ({
  productStock,
  productCartQty,
  quantityCount,
  totalCartQty,
  wishlistItem,
  compareItem,
  product,
  selectedProductColor,
  selectedProductSize,
  selectedVariant,
}) => {
  const t = useTranslate();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

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

  const handleShopNowButtonClick = () => {
    handleDispatchAddToCart();
    navigate("/pages/checkout");
  };

  const handleDBShopNowButtonClick = async () => {
    try {
      await handleDispatchAddToDB();
      navigate("/pages/checkout");
    } catch (error) {
      console.error("Error adding to DB:", error);
    }
  };

  return (
    <div className="pro-details-quality">
      <div className="pro-details-cart btn-hover">
        {productStock && productStock > 0 ? (
          <Authenticated
            key="pro-details-quality"
            fallback={
              <Tooltip
                title={
                  isButtonDisabled
                    ? t("products.messages.max_cart_size")
                    : productCartQty >= productStock
                    ? t("products.messages.limit_reached")
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
                  ? t("products.messages.max_cart_size")
                  : productCartQty >= productStock
                  ? t("products.messages.limit_reached")
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
          <button className="mw-250 button-black" disabled>
            {t(`products.desc_tab.buttons.out_of_stock`)}
          </button>
        )}
      </div>
      {productStock > 0 && (
        <div className="pro-details-cart btn-hover">
          <Authenticated
            key="pro-details-cart btn-hover"
            fallback={
              <Tooltip
                title={
                  isButtonDisabled
                    ? t("products.messages.max_cart_size")
                    : productCartQty >= productStock
                    ? t("products.messages.limit_reached")
                    : ""
                }
              >
                <button
                  className="button-black"
                  onClick={handleShopNowButtonClick}
                  disabled={isButtonDisabled}
                >
                  {t("products.buttons.shop_now")}
                </button>
              </Tooltip>
            }
          >
            <Tooltip
              title={
                isButtonDisabled
                  ? t("products.messages.max_cart_size")
                  : productCartQty >= productStock
                  ? t("products.messages.limit_reached")
                  : ""
              }
            >
              <button
                className="button-black"
                onClick={handleDBShopNowButtonClick}
                disabled={isButtonDisabled}
              >
                {t("products.buttons.shop_now")}
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
              ? t("product_action.tooltips.wishlist.in")
              : t("product_action.tooltips.wishlist.out")
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
              ? t("product_action.tooltips.compare.in")
              : t("product_action.tooltips.compare.out")
          }
          onClick={() => dispatch(addToCompare(product))}
        >
          <i className="pe-7s-shuffle" />
        </button>
      </div>
    </div>
  );
};

export default ProductDetailsButtons;

import { FC } from "react";
import { showErrorToast } from "../../../helpers/toast";
import { useTranslate } from "@refinedev/core";

interface ProductQuantityControlProps {
  quantityCount: number;
  productCartQty: number;
  totalCartQty: number;
  productStock: number;
  setQuantityCount: (value: React.SetStateAction<number>) => void;
}

const ProductQuantityControl: FC<ProductQuantityControlProps> = ({
  quantityCount,
  productCartQty,
  totalCartQty,
  productStock,
  setQuantityCount,
}) => {
  const t = useTranslate();

  return (
    <div className="pro-details-quality">
      <div className="cart-plus-minus">
        <button
          onClick={() => {
            if (quantityCount <= 1) {
              return showErrorToast(t("products.messages.min_reached"));
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
            if (quantityCount + productCartQty >= 5 || totalCartQty >= 5) {
              return showErrorToast(t("products.messages.max_cart_size"));
            }

            if (quantityCount >= productStock - productCartQty) {
              return showErrorToast(t("products.messages.limit_reached"));
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
        <span>{t("products.fields.stock")}</span>
      </div>
    </div>
  );
};

export default ProductQuantityControl;

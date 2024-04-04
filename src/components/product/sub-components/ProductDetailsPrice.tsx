import { FC, Fragment } from "react";
import { ISizeClient } from "../../../interfaces";
import { getDiscountPrice } from "../../../helpers/product";
import { CurrencyState } from "../../../redux/slices/currency-slice";
import { CurrencyFormatter } from "../../../helpers/currency";

interface ProductDetailsPriceProps {
  selectedProductSize: ISizeClient;
  currency: CurrencyState;
}

const ProductDetailsPrice: FC<ProductDetailsPriceProps> = ({
  selectedProductSize,
  currency,
}) => {
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

  if (discountedPrice) {
    return (
      <Fragment>
        <CurrencyFormatter value={finalDiscountedPrice} currency={currency} />{" "}
        <CurrencyFormatter
          className="old"
          value={finalProductPrice}
          currency={currency}
        />
      </Fragment>
    );
  } else {
    return <CurrencyFormatter value={finalProductPrice} currency={currency} />;
  }
};

export default ProductDetailsPrice;

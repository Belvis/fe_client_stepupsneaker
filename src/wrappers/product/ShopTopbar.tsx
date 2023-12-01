import React, { Fragment } from "react";
import ShopTopAction from "../../components/product/ShopTopAction";

interface ShopTopbarProps {
  updateLayout: (
    layout: "grid two-column" | "grid three-column" | "list"
  ) => void;
  updateSortParams: (orderBy: string) => void;
  productCount: number;
  sortedProductCount: number;
}

const ShopTopbar: React.FC<ShopTopbarProps> = ({
  updateLayout,
  updateSortParams,
  productCount,
  sortedProductCount,
}) => {
  return (
    <Fragment>
      {/* shop top action */}
      <ShopTopAction
        updateLayout={updateLayout}
        updateSortParams={updateSortParams}
        productCount={productCount}
        sortedProductCount={sortedProductCount}
      />
    </Fragment>
  );
};

export default ShopTopbar;

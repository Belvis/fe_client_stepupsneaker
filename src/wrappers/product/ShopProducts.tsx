import React from "react";
import clsx from "clsx";
import ProductgridList from "./ProductgridList";
import { IProductClient } from "../../interfaces";

interface ShopProductsProps {
  products: IProductClient[];
  layout: string;
}

const ShopProducts: React.FC<ShopProductsProps> = ({ products, layout }) => {
  return (
    <div className="shop-bottom-area mt-35">
      <div className={clsx("row", layout)}>
        <ProductgridList products={products} spaceBottomClass="mb-25" />
      </div>
    </div>
  );
};

export default ShopProducts;

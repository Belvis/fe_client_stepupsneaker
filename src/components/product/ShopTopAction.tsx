import React from "react";
import { setActiveLayout } from "../../helpers/product";

interface ShopTopActionProps {
  updateLayout: (layout: string) => void;
  updateSortParams: (sortType: "asc" | "desc", sortValue: string) => void;
  productCount: number;
  sortedProductCount: number;
}

const sortOptions: {
  [key: string]: { order: string; field: string };
} = {
  default: { order: "", field: "" },
  priceHighToLow: { order: "desc", field: "price" },
  priceLowToHigh: { order: "asc", field: "price" },
};

const ShopTopAction: React.FC<ShopTopActionProps> = ({
  updateLayout,
  updateSortParams,
  productCount,
  sortedProductCount,
}) => {
  return (
    <div className="shop-top-bar mb-35">
      <div className="select-shoing-wrap">
        <div className="shop-select">
          <select
            onChange={(e) => {
              const { order, field } = sortOptions[e.target.value];
              updateSortParams(order as "asc" | "desc", field);
            }}
          >
            <option value="default">Default</option>
            <option value="priceHighToLow">Price - High to Low</option>
            <option value="priceLowToHigh">Price - Low to High</option>
          </select>
        </div>
        <p>
          Showing {sortedProductCount} of {productCount} result
        </p>
      </div>

      <div className="shop-tab">
        <button
          onClick={(e) => {
            updateLayout("grid two-column");
            setActiveLayout(e);
          }}
        >
          <i className="fa fa-th-large" />
        </button>
        <button
          onClick={(e) => {
            updateLayout("grid three-column");
            setActiveLayout(e);
          }}
        >
          <i className="fa fa-th" />
        </button>
        <button
          onClick={(e) => {
            updateLayout("list");
            setActiveLayout(e);
          }}
        >
          <i className="fa fa-list-ul" />
        </button>
      </div>
    </div>
  );
};

export default ShopTopAction;

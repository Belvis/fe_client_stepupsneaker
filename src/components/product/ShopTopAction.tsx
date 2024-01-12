import React from "react";
import { setActiveLayout } from "../../helpers/product";

interface ShopTopActionProps {
  updateLayout: (
    layout: "grid two-column" | "grid three-column" | "list"
  ) => void;
  updateSortParams: (orderBy: string) => void;
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
        <span>Sắp xếp theo</span>
        <div className="shop-select">
          <select onChange={(e) => updateSortParams(e.target.value)}>
            <option value="default">Mặc định</option>
            <option value="popularity">Phổ biến</option>
            <option value="best-seller">Bán chạy</option>
            <option value="newest">Mới nhất</option>
            <option value="latest">Cũ nhất</option>
            <option value="price">Giá - Từ cao đến thấp</option>
            <option value="price-desc">Giá - từ thấp đến cao</option>
          </select>
        </div>
        <p>
          Hiển thị {sortedProductCount} kết quả trên tổng số {productCount} kết
          quả
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

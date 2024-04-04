import React from "react";
import { setActiveLayout } from "../../helpers/product";
import { useTranslate } from "@refinedev/core";

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
  const t = useTranslate();
  return (
    <div className="shop-top-bar mb-35">
      <div className="select-shoing-wrap">
        <span>{t("sort.sort_by")}</span>
        <div className="shop-select">
          <select onChange={(e) => updateSortParams(e.target.value)}>
            <option value="default">{t("sort.default")}</option>
            <option value="popularity">{t("sort.popularity")}</option>
            <option value="best-seller">{t("sort.best_seller")}</option>
            <option value="newest">{t("sort.newest")}</option>
            <option value="latest">{t("sort.oldest")}</option>
            <option value="price">{t("sort.price_high_to_low")}</option>
            <option value="price-desc">{t("sort.price_low_to_high")}</option>
          </select>
        </div>
        <p>
          {t("sort.showing")} {sortedProductCount} {t("sort.results")}{" "}
          {t("sort.out_of")} {productCount} {t("sort.results")}
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

import React from "react";
import { setActiveSort } from "../../helpers/product";
import { ISizeResponse } from "../../interfaces";

interface ShopSizeProps {
  sizes: ISizeResponse[];
  updateFilterParams: (field: string, value: string) => void;
}

const ShopSize: React.FC<ShopSizeProps> = ({ sizes, updateFilterParams }) => {
  return (
    <div className="sidebar-widget mt-40">
      <h4 className="pro-sidebar-title">Size </h4>
      <div className="sidebar-widget-list mt-20">
        {sizes ? (
          <ul>
            <li>
              <div className="sidebar-widget-list-left">
                <button
                  onClick={(e) => {
                    updateFilterParams("size", "");
                    setActiveSort(e);
                  }}
                >
                  <span className="checkmark" /> All Sizes{" "}
                </button>
              </div>
            </li>
            {sizes.map((size, key) => {
              return (
                <li key={key}>
                  <div className="sidebar-widget-list-left">
                    <button
                      className="text-uppercase"
                      onClick={(e) => {
                        updateFilterParams("size", size.id);
                        setActiveSort(e);
                      }}
                    >
                      {" "}
                      <span className="checkmark" />
                      {size.name}{" "}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          "No sizes found"
        )}
      </div>
    </div>
  );
};

export default ShopSize;

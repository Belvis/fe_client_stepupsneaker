import React from "react";
import { setActiveSort } from "../../helpers/product";
import { IColorResponse } from "../../interfaces";

interface ShopColorProps {
  colors: IColorResponse[];
  updateFilterParams: (field: string, value: string) => void;
}

const ShopColor: React.FC<ShopColorProps> = ({
  colors,
  updateFilterParams,
}) => {
  return (
    <div className="sidebar-widget mt-50">
      <h4 className="pro-sidebar-title">Color </h4>
      <div className="sidebar-widget-list mt-20">
        {colors ? (
          <ul>
            <li>
              <div className="sidebar-widget-list-left">
                <button
                  onClick={(e) => {
                    updateFilterParams("color", "");
                    setActiveSort(e);
                  }}
                >
                  <span className="checkmark" /> All Colors{" "}
                </button>
              </div>
            </li>
            {colors.map((color, key) => {
              return (
                <li key={key}>
                  <div className="sidebar-widget-list-left">
                    <button
                      onClick={(e) => {
                        updateFilterParams("color", color.id);
                        setActiveSort(e);
                      }}
                    >
                      <span className="checkmark" /> {color.name}{" "}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          "No colors found"
        )}
      </div>
    </div>
  );
};

export default ShopColor;

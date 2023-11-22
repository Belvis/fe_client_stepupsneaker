import React from "react";
import { setActiveSort } from "../../helpers/product";
import { IStyleResponse } from "../../interfaces";

interface ShopStylesProps {
  styles: IStyleResponse[];
  updateFilterParams: (field: string, value: string) => void;
}

const ShopStyles: React.FC<ShopStylesProps> = ({
  styles,
  updateFilterParams,
}) => {
  return (
    <div className="sidebar-widget">
      <h4 className="pro-sidebar-title">Styles </h4>
      <div className="sidebar-widget-list mt-30">
        {styles ? (
          <ul>
            <li>
              <div className="sidebar-widget-list-left">
                <button
                  onClick={(e) => {
                    updateFilterParams("style", "");
                    setActiveSort(e);
                  }}
                >
                  <span className="checkmark" /> All Styles
                </button>
              </div>
            </li>
            {styles.map((style, key) => {
              return (
                <li key={key}>
                  <div className="sidebar-widget-list-left">
                    <button
                      onClick={(e) => {
                        updateFilterParams("style", style.id);
                        setActiveSort(e);
                      }}
                    >
                      {" "}
                      <span className="checkmark" /> {style.name}{" "}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          "No styles found"
        )}
      </div>
    </div>
  );
};

export default ShopStyles;

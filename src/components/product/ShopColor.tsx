import React from "react";
import { setActiveSort } from "../../helpers/product";
import { IColorResponse } from "../../interfaces";
import { Collapse, CollapseProps } from "antd";

interface ShopColorProps {
  colors: IColorResponse[];
  updateFilterParams: (field: string, value: string) => void;
}

const ShopColor: React.FC<ShopColorProps> = ({
  colors,
  updateFilterParams,
}) => {
  const items: CollapseProps["items"] = [
    {
      key: "color",
      label: <h4 className="pro-sidebar-title">Màu sắc</h4>,
      children: (
        <div className="sidebar-widget-list mt-20">
          {colors ? (
            <ul>
              {colors.map((color, key) => {
                return (
                  <li key={key}>
                    <div className="sidebar-widget-list-left">
                      <button
                        onClick={(e) => {
                          updateFilterParams("colors", color.id);
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
            "Không tìm thấy màu sắc"
          )}
        </div>
      ),
    },
  ];
  return (
    <div className="sidebar-widget mt-50">
      <Collapse ghost items={items} />
    </div>
  );
};

export default ShopColor;

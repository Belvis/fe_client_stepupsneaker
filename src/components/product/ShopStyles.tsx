import React from "react";
import { setActiveSort } from "../../helpers/product";
import { IStyleResponse } from "../../interfaces";
import { Collapse, CollapseProps } from "antd";

interface ShopStylesProps {
  styles: IStyleResponse[];
  updateFilterParams: (field: string, value: string) => void;
}

const ShopStyles: React.FC<ShopStylesProps> = ({
  styles,
  updateFilterParams,
}) => {
  const items: CollapseProps["items"] = [
    {
      key: "style",
      label: <h4 className="pro-sidebar-title">Kiểu dáng</h4>,
      children: (
        <div className="sidebar-widget-list mt-30">
          {styles ? (
            <ul>
              {styles.map((style, key) => {
                return (
                  <li key={key}>
                    <div className="sidebar-widget-list-left">
                      <button
                        onClick={(e) => {
                          updateFilterParams("styles", style.id);
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
            "Không tìm thấy màu sắc"
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="sidebar-widget">
      <Collapse ghost items={items} />
    </div>
  );
};

export default ShopStyles;

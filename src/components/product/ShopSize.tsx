import React from "react";
import { setActiveSort } from "../../helpers/product";
import { ISizeResponse } from "../../interfaces";
import { Collapse, CollapseProps } from "antd";

interface ShopSizeProps {
  sizes: ISizeResponse[];
  updateFilterParams: (field: string, value: string) => void;
}

const ShopSize: React.FC<ShopSizeProps> = ({ sizes, updateFilterParams }) => {
  const items: CollapseProps["items"] = [
    {
      key: "color",
      label: <h4 className="pro-sidebar-title">Kích cỡ</h4>,
      children: (
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
                    <span className="checkmark" />
                    Tất cả{" "}
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
            "Không tìm thấy kích cỡ"
          )}
        </div>
      ),
    },
  ];
  return (
    <div className="sidebar-widget mt-40">
      <Collapse ghost items={items} />
    </div>
  );
};

export default ShopSize;

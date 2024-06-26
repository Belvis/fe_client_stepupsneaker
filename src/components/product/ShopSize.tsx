import React from "react";
import { setActiveSort } from "../../helpers/product";
import { ISizeResponse } from "../../interfaces";
import { Collapse, CollapseProps } from "antd";
import { useTranslate } from "@refinedev/core";

interface ShopSizeProps {
  sizes: ISizeResponse[];
  updateFilterParams: (field: string, value: string) => void;
}

const ShopSize: React.FC<ShopSizeProps> = ({ sizes, updateFilterParams }) => {
  const t = useTranslate();
  const items: CollapseProps["items"] = [
    {
      key: "color",
      label: (
        <h4 className="pro-sidebar-title">{t("products.fields.sizes")}</h4>
      ),
      children: (
        <div className="sidebar-widget-list mt-20">
          {sizes ? (
            <ul>
              {sizes.map((size, key) => {
                return (
                  <li key={key}>
                    <div className="sidebar-widget-list-left">
                      <button
                        className="text-uppercase"
                        onClick={(e) => {
                          updateFilterParams("sizes", size.id);
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

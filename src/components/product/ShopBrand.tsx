import React from "react";
import { setActiveSort } from "../../helpers/product";
import { IBrandResponse } from "../../interfaces";
import { Collapse, CollapseProps } from "antd";

interface ShopBrandProps {
  brands: IBrandResponse[];
  updateFilterParams: (field: string, value: string) => void;
}

const ShopBrand: React.FC<ShopBrandProps> = ({
  brands,
  updateFilterParams,
}) => {
  const items: CollapseProps["items"] = [
    {
      key: "brand",
      label: <h4 className="pro-sidebar-title">Nhãn hiệu</h4>,
      children: (
        <div className="sidebar-widget-list mt-20">
          {brands ? (
            <ul>
              <li>
                <div className="sidebar-widget-list-left">
                  <button
                    onClick={(e) => {
                      updateFilterParams("brand", "");
                      setActiveSort(e);
                    }}
                  >
                    <span className="checkmark" />
                    Tất cả{" "}
                  </button>
                </div>
              </li>
              {brands.map((brand, key) => {
                return (
                  <li key={key}>
                    <div className="sidebar-widget-list-left">
                      <button
                        className="text-uppercase"
                        onClick={(e) => {
                          updateFilterParams("brand", brand.id);
                          setActiveSort(e);
                        }}
                      >
                        {" "}
                        <span className="checkmark" />
                        {brand.name}{" "}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            "Không tìm thấy nhãn hiệu"
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

export default ShopBrand;

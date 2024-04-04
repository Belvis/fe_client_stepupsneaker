import React from "react";
import { setActiveSort } from "../../helpers/product";
import { IMaterialResponse } from "../../interfaces";
import { Collapse, CollapseProps } from "antd";
import { useTranslate } from "@refinedev/core";

interface ShopMaterialProps {
  materials: IMaterialResponse[];
  updateFilterParams: (field: string, value: string) => void;
}

const ShopMaterial: React.FC<ShopMaterialProps> = ({
  materials,
  updateFilterParams,
}) => {
  const t = useTranslate();

  const items: CollapseProps["items"] = [
    {
      key: "material",
      label: (
        <h4 className="pro-sidebar-title">{t("products.fields.materials")}</h4>
      ),
      children: (
        <div className="sidebar-widget-list mt-20">
          {materials ? (
            <ul>
              {materials.map((material, key) => {
                return (
                  <li key={key}>
                    <div className="sidebar-widget-list-left">
                      <button
                        className="text-uppercase"
                        onClick={(e) => {
                          updateFilterParams("materials", material.id);
                          setActiveSort(e);
                        }}
                      >
                        {" "}
                        <span className="checkmark" />
                        {material.name}{" "}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            "Không tìm thấy chất liệu"
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

export default ShopMaterial;

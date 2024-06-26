import React from "react";
import { setActiveSort } from "../../helpers/product";
import { ISoleResponse } from "../../interfaces";
import { Collapse, CollapseProps } from "antd";
import { useTranslate } from "@refinedev/core";

interface ShopSoleProps {
  soles: ISoleResponse[];
  updateFilterParams: (field: string, value: string) => void;
}

const ShopSole: React.FC<ShopSoleProps> = ({ soles, updateFilterParams }) => {
  const t = useTranslate();
  const items: CollapseProps["items"] = [
    {
      key: "sole",
      label: (
        <h4 className="pro-sidebar-title">{t("products.fields.soles")}</h4>
      ),
      children: (
        <div className="sidebar-widget-list mt-20">
          {soles ? (
            <ul>
              {soles.map((sole, key) => {
                return (
                  <li key={key}>
                    <div className="sidebar-widget-list-left">
                      <button
                        className="text-uppercase"
                        onClick={(e) => {
                          updateFilterParams("soles", sole.id);
                          setActiveSort(e);
                        }}
                      >
                        {" "}
                        <span className="checkmark" />
                        {sole.name}{" "}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            "Không tìm thấy đế giày"
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

export default ShopSole;

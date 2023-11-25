import React from "react";
import { setActiveSort } from "../../helpers/product";
import { ISoleResponse } from "../../interfaces";
import { Collapse, CollapseProps } from "antd";

interface ShopSoleProps {
  soles: ISoleResponse[];
  updateFilterParams: (field: string, value: string) => void;
}

const ShopSole: React.FC<ShopSoleProps> = ({ soles, updateFilterParams }) => {
  const items: CollapseProps["items"] = [
    {
      key: "sole",
      label: <h4 className="pro-sidebar-title">Đế giày</h4>,
      children: (
        <div className="sidebar-widget-list mt-20">
          {soles ? (
            <ul>
              <li>
                <div className="sidebar-widget-list-left">
                  <button
                    onClick={(e) => {
                      updateFilterParams("sole", "");
                      setActiveSort(e);
                    }}
                  >
                    <span className="checkmark" />
                    Tất cả{" "}
                  </button>
                </div>
              </li>
              {soles.map((sole, key) => {
                return (
                  <li key={key}>
                    <div className="sidebar-widget-list-left">
                      <button
                        className="text-uppercase"
                        onClick={(e) => {
                          updateFilterParams("sole", sole.id);
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

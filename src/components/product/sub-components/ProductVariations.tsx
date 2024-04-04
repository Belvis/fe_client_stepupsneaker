import React from "react";
import { useTranslate } from "@refinedev/core";
import { Badge, Space } from "antd";
import { ChangeEventHandler, FC } from "react";
import {
  IColorResponse,
  IProductClient,
  ISizeClient,
} from "../../../interfaces";
import { SaleIcon } from "../../icons/icon-sale";
import clsx from "clsx";

interface ProductVariationsProps {
  selectedProductSize: ISizeClient;
  selectedProductColor: IColorResponse;
  product: IProductClient;
  setSelectedProductSize: (value: React.SetStateAction<ISizeClient>) => void;
  setSelectedProductColor: (
    value: React.SetStateAction<IColorResponse>
  ) => void;
  setProductStock: (value: React.SetStateAction<number>) => void;
  setQuantityCount: (value: React.SetStateAction<number>) => void;
}

const ProductVariations: FC<ProductVariationsProps> = React.memo(
  ({
    product,
    selectedProductColor,
    selectedProductSize,
    setSelectedProductSize,
    setSelectedProductColor,
    setProductStock,
    setQuantityCount,
  }) => {
    const t = useTranslate();

    return (
      <div className="pro-details-size-color">
        <div className="pro-details-color-wrap">
          <Space direction="vertical">
            <span>{t(`products.fields.colors`)}</span>
            <div className="pro-details-color-content">
              {product.variation.map((single, key) => {
                const hasSale = single.size.some(
                  (size) =>
                    typeof size.discount === "number" && size.discount > 0
                );

                return (
                  <label
                    className={`pro-details-color-content--single ${
                      single.color.id
                    } ${
                      single.color.id === selectedProductColor.id
                        ? "selected"
                        : ""
                    }`}
                    key={key}
                    style={{
                      background: `#${single.color.code}`,
                      border: "2px solid white",
                      outline: "transparent solid 2px ",
                    }}
                  >
                    <Badge
                      offset={[20, 0]}
                      count={
                        hasSale ? (
                          <SaleIcon
                            style={{
                              color: "red",
                              fontSize: "24px",
                              zIndex: 2,
                            }}
                          />
                        ) : (
                          0
                        )
                      }
                    >
                      <input
                        type="radio"
                        value={single.color.id}
                        name="product-color"
                        checked={single.color.id === selectedProductColor.id}
                        onChange={() => {
                          setSelectedProductColor(single.color);
                          setSelectedProductSize(single.size[0]);
                          setProductStock(single.size[0].stock);
                          setQuantityCount(1);
                        }}
                      />
                    </Badge>
                  </label>
                );
              })}
            </div>
          </Space>
        </div>
        <div className="pro-details-size">
          <Space direction="vertical">
            <span>{t(`products.fields.sizes`)}</span>
            <div className="pro-details-size-content">
              {product.variation &&
                product.variation.map((single) => {
                  return single.color.id === selectedProductColor.id
                    ? single.size.map((singleSize, key) => {
                        const hasSale = singleSize.discount > 0;
                        return (
                          <label
                            className={`pro-details-size-content--single`}
                            key={key}
                          >
                            <Badge
                              count={
                                hasSale ? (
                                  <SaleIcon
                                    style={{
                                      color: "red",
                                      fontSize: "24px",
                                      zIndex: 2,
                                    }}
                                  />
                                ) : (
                                  0
                                )
                              }
                            >
                              <input
                                type="radio"
                                value={singleSize.id}
                                checked={
                                  singleSize.id === selectedProductSize.id
                                }
                                onChange={() => {
                                  setSelectedProductSize(singleSize);
                                  setProductStock(singleSize.stock);
                                  setQuantityCount(1);
                                }}
                              />
                              <span className="size-name">
                                {singleSize.name}
                              </span>
                            </Badge>
                          </label>
                        );
                      })
                    : "";
                })}
            </div>
          </Space>
        </div>
      </div>
    );
  }
);

export default ProductVariations;

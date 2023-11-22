import React from "react";
import clsx from "clsx";
import ShopSearch from "../../components/product/ShopSearch";
import ShopStyles from "../../components/product/ShopStyles";
import ShopColor from "../../components/product/ShopColor";
import ShopSize from "../../components/product/ShopSize";
import {
  IColorResponse,
  ISizeResponse,
  IStyleResponse,
} from "../../interfaces";
import { HttpError, useList } from "@refinedev/core";

interface ShopSidebarProps {
  updateFilterParams: (field: string, value: string) => void;
  sideSpaceClass?: string;
}

const ShopSidebar: React.FC<ShopSidebarProps> = ({
  updateFilterParams,
  sideSpaceClass,
}) => {
  const {
    data: styleData,
    isLoading: isStyleLoading,
    isError: isStyleError,
  } = useList<IStyleResponse, HttpError>({
    resource: "styles",
    pagination: {
      pageSize: 1000,
    },
  });

  const {
    data: colorData,
    isLoading: isColorLoading,
    isError: isColorError,
  } = useList<IColorResponse, HttpError>({
    resource: "colors",
    pagination: {
      pageSize: 1000,
    },
  });

  const {
    data: sizeData,
    isLoading: isSizeLoading,
    isError: isSizeError,
  } = useList<ISizeResponse, HttpError>({
    resource: "sizes",
    pagination: {
      pageSize: 1000,
    },
  });

  const uniqueStyles = styleData?.data ? styleData.data : [];
  const uniqueColors = colorData?.data ? colorData.data : [];
  const uniqueSizes = sizeData?.data ? sizeData.data : [];

  return (
    <div className={clsx("sidebar-style", sideSpaceClass)}>
      {/* shop search */}
      <ShopSearch />

      {/* filter by categories */}
      <ShopStyles
        styles={uniqueStyles}
        updateFilterParams={updateFilterParams}
      />

      {/* filter by color */}
      <ShopColor
        colors={uniqueColors}
        updateFilterParams={updateFilterParams}
      />

      {/* filter by size */}
      <ShopSize sizes={uniqueSizes} updateFilterParams={updateFilterParams} />

      {/* filter by tag */}
    </div>
  );
};

export default ShopSidebar;

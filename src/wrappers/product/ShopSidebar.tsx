import React from "react";
import clsx from "clsx";
import ShopSearch from "../../components/product/ShopSearch";
import ShopStyles from "../../components/product/ShopStyles";
import ShopColor from "../../components/product/ShopColor";
import ShopSize from "../../components/product/ShopSize";
import {
  IBrandResponse,
  IColorResponse,
  IMaterialResponse,
  ISizeResponse,
  ISoleResponse,
  IStyleResponse,
} from "../../interfaces";
import { HttpError, useList } from "@refinedev/core";
import ShopBrand from "../../components/product/ShopBrand";
import ShopMaterial from "../../components/product/ShopMaterial";
import ShopSole from "../../components/product/ShopSole";

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
    resource: "products/styles",
    pagination: {
      pageSize: 1000,
    },
    sorters: [
      {
        field: "name",
        order: "asc",
      },
    ],
  });

  const {
    data: colorData,
    isLoading: isColorLoading,
    isError: isColorError,
  } = useList<IColorResponse, HttpError>({
    resource: "products/colors",
    pagination: {
      pageSize: 1000,
    },
    sorters: [
      {
        field: "name",
        order: "asc",
      },
    ],
  });

  const {
    data: sizeData,
    isLoading: isSizeLoading,
    isError: isSizeError,
  } = useList<ISizeResponse, HttpError>({
    resource: "products/sizes",
    pagination: {
      pageSize: 1000,
    },
    sorters: [
      {
        field: "name",
        order: "asc",
      },
    ],
  });

  const {
    data: brandData,
    isLoading: isBrandLoading,
    isError: isBrandError,
  } = useList<IBrandResponse, HttpError>({
    resource: "products/brands",
    pagination: {
      pageSize: 1000,
    },
    sorters: [
      {
        field: "name",
        order: "asc",
      },
    ],
  });

  const {
    data: materialData,
    isLoading: isMaterialLoading,
    isError: isMaterialError,
  } = useList<IMaterialResponse, HttpError>({
    resource: "products/materials",
    pagination: {
      pageSize: 1000,
    },
    sorters: [
      {
        field: "name",
        order: "asc",
      },
    ],
  });

  const {
    data: soleData,
    isLoading: isSoleLoading,
    isError: isSoleError,
  } = useList<ISoleResponse, HttpError>({
    resource: "products/soles",
    pagination: {
      pageSize: 1000,
    },
    sorters: [
      {
        field: "name",
        order: "asc",
      },
    ],
  });

  const uniqueStyles = styleData?.data ? styleData.data : [];
  const uniqueColors = colorData?.data ? colorData.data : [];
  const uniqueSizes = sizeData?.data ? sizeData.data : [];
  const uniqueBrands = brandData?.data ? brandData.data : [];
  const uniqueMaterials = materialData?.data ? materialData.data : [];
  const uniqueSoles = soleData?.data ? soleData.data : [];

  return (
    <div className={clsx("sidebar-style", sideSpaceClass)}>
      {/* shop search */}
      <ShopSearch updateFilterParams={updateFilterParams} />

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

      {/* filter by brand */}
      <ShopBrand
        brands={uniqueBrands}
        updateFilterParams={updateFilterParams}
      />

      {/* filter by material */}
      <ShopMaterial
        materials={uniqueMaterials}
        updateFilterParams={updateFilterParams}
      />

      {/* filter by sole */}
      <ShopSole soles={uniqueSoles} updateFilterParams={updateFilterParams} />

      {/* filter by tag */}
    </div>
  );
};

export default ShopSidebar;

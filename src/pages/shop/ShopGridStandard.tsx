import {
  CrudFilter,
  CrudFilters,
  CrudSorting,
  HttpError,
  useList,
} from "@refinedev/core";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import { Pagination, PaginationProps, Spin } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useSearchParams } from "react-router-dom";
import { mapProductsToClients } from "../../helpers/product";
import { IProductResponse } from "../../interfaces";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import ShopProducts from "../../wrappers/product/ShopProducts";
import ShopSidebar from "../../wrappers/product/ShopSidebar";
import ShopTopbar from "../../wrappers/product/ShopTopbar";

const ShopGridStandard: React.FC = () => {
  const { t } = useTranslation();

  const setTitle = useDocumentTitle();
  let { pathname } = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();

  const setDefaultParam = (param: string, defaultValue: string) => {
    if (!searchParams.get(param)) {
      setSearchParams((prev) => {
        prev.set(param, defaultValue);
        return prev;
      });
    }
  };

  useEffect(() => {
    setDefaultParam("page", "1");
    setDefaultParam("layout", "grid three-column");
  }, []);

  const [totalElements, setTotalElements] = useState<number>(0);
  const [currentData, setCurrentData] = useState<any[]>([]);
  const pageLimit: number = 15;

  const layout = searchParams.get("layout") ?? "grid three-column";
  const currentPage = Number(searchParams.get("page")) || 1;

  const filterFieldsMappings = {
    styles: "styles",
    colors: "colors",
    sizes: "sizes",
    brands: "brands",
    materials: "materials",
    soles: "soles",
  };

  const getFiltersFromSearchParams = (): CrudFilters => {
    const filters: CrudFilter[] = [];

    Object.entries(filterFieldsMappings).forEach(([field, paramName]) => {
      const values = searchParams.getAll(paramName);

      if (values.length > 0) {
        filters.push({
          field,
          operator: "eq",
          value: values,
        });
      }
    });

    const q = searchParams.get("q") ?? "";

    if (q) {
      filters.push({
        field: "q",
        operator: "eq",
        value: q,
      });
    }

    return filters;
  };

  const getSortersFromSearchParams = (): CrudSorting => {
    const sorters: CrudSorting = [];
    const orderBy = searchParams.get("order_by");

    if (orderBy && orderBy != "") {
      switch (orderBy) {
        case "price":
          sorters.push({
            field: "price",
            order: "asc",
          });
          break;
        case "price-desc":
          sorters.push({
            field: "price",
            order: "desc",
          });
          break;
        // case "popularity":
        //   sorters.push({
        //     field: "popularity", // view - rating - interaction
        //     order: "desc"
        //   })
        //   break;
        case "latest":
          sorters.push({
            field: "createdAt",
            order: "desc",
          });
          break;
        case "newest":
          sorters.push({
            field: "createdAt",
            order: "asc",
          });
          break;
        case "best-seller":
          sorters.push({
            field: "saleCount",
            order: "desc",
          });
          break;
        default:
          break;
      }
    }
    return sorters;
  };

  const updateLayout = (
    layout: "grid two-column" | "grid three-column" | "list"
  ): void => {
    setSearchParams((prev: URLSearchParams) => {
      prev.set("layout", layout);
      return prev;
    });
  };

  const updateSortParams = (orderBy: string): void => {
    setSearchParams((prev: URLSearchParams) => {
      prev.set("order_by", orderBy);
      return prev;
    });
  };

  const updateFilterParams = (field: string, value: string): void => {
    setSearchParams((prev: URLSearchParams) => {
      if (field === "q") {
        if (value === "") {
          prev.delete("q");
        } else {
          prev.set("q", value);
        }
        return prev;
      }

      const existingValues = prev.getAll(field);

      if (existingValues.includes(value)) {
        prev.delete(field, value);
      } else {
        prev.append(field, value);
      }

      return prev;
    });
  };

  const { data, isLoading, isError } = useList<IProductResponse, HttpError>({
    resource: "products",
    pagination: {
      pageSize: pageLimit,
      current: currentPage,
    },
    filters: getFiltersFromSearchParams(),
    sorters: getSortersFromSearchParams(),
  });

  useEffect(() => {
    if (data?.data) {
      setCurrentData(mapProductsToClients(data.data));
      setTotalElements(data.total);
    }
  }, [data]);

  useEffect(() => {
    setTitle(t("nav.shop") + " | SUNS");
  }, [searchParams]);

  const onChange: PaginationProps["onChange"] = (page) => {
    setSearchParams((prev: URLSearchParams) => {
      prev.set("page", page.toString());
      return prev;
    });
  };

  return (
    <Fragment>
      <Breadcrumb
        pages={[
          { label: "home", path: "/" },
          { label: "shop", path: pathname },
        ]}
      />

      <Spin spinning={isLoading} fullscreen />

      <div className="shop-area pt-95 pb-100 bg-white">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 order-2 order-lg-1">
              {/* shop sidebar */}
              <ShopSidebar
                updateFilterParams={updateFilterParams}
                sideSpaceClass="mr-30"
              />
            </div>
            <div className="col-lg-9 order-1 order-lg-2">
              {/* shop topbar default */}
              <ShopTopbar
                updateLayout={updateLayout}
                updateSortParams={updateSortParams}
                productCount={totalElements}
                sortedProductCount={currentData.length}
              />

              {/* shop page content default */}
              <ShopProducts layout={layout} products={currentData} />

              {/* shop product pagination */}
              <div className="pro-pagination-style text-center mt-30">
                {/* Pagination */}
                <Pagination
                  current={currentPage}
                  total={totalElements}
                  showSizeChanger={false}
                  onChange={onChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ShopGridStandard;

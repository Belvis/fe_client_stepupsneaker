import React, { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CrudFilters, CrudSorting, HttpError, useList } from "@refinedev/core";
import { Spin } from "antd";
import { mapProductsToClients } from "../../helpers/product";
import { IProductResponse } from "../../interfaces";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import ShopProducts from "../../wrappers/product/ShopProducts";
import ShopSidebar from "../../wrappers/product/ShopSidebar";
import ShopTopbar from "../../wrappers/product/ShopTopbar";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@refinedev/react-router-v6";

const ShopGridStandard: React.FC = () => {
  const { t } = useTranslation();

  useDocumentTitle(t("nav.shop") + " | SUNS");

  const [layout, setLayout] = useState<string>("grid three-column");
  const [filters, setFilters] = useState<CrudFilters>([]);
  const [sorters, setSorters] = useState<CrudSorting>([]);
  const [offset, setOffset] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentData, setCurrentData] = useState<any[]>([]);
  const [sortedProducts, setSortedProducts] = useState<any[]>([]);

  const pageLimit: number = 15;
  let { pathname } = useLocation();

  const updateLayout = (layout: string): void => {
    setLayout(layout);
  };

  const updateSortParams = (
    sortType: "asc" | "desc",
    sortValue: string
  ): void => {
    setSorters((prev) => [
      ...prev,
      {
        field: sortValue,
        order: sortType,
      },
    ]);
  };

  const updateFilterParams = (field: string, value: string): void => {
    setFilters((prev) => [
      ...prev,
      {
        field,
        operator: "eq",
        value,
      },
    ]);
  };

  const { data, isLoading, isError } = useList<IProductResponse, HttpError>({
    resource: "products",
    pagination: {
      pageSize: pageLimit,
    },
    filters: filters,
    sorters: sorters,
  });

  useEffect(() => {
    if (data?.data) {
      setSortedProducts(sortedProducts);
      setCurrentData(mapProductsToClients(data.data));
      setTotalElements(data.total);
    }
  }, [offset, data, filters, sorters]);

  return (
    <Fragment>
      <Breadcrumb
        pages={[
          { label: "home", path: "/" },
          { label: "shop", path: pathname },
        ]}
      />

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
              <Spin spinning={isLoading}>
                <ShopProducts layout={layout} products={currentData} />
              </Spin>

              {/* shop product pagination */}
              <div className="pro-pagination-style text-center mt-30">
                {/* Pagination */}
                {/* <Paginator
                  totalRecords={sortedProducts.length}
                  pageLimit={pageLimit}
                  pageNeighbours={2}
                  setOffset={setOffset}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  pageContainerClass="mb-0 mt-0"
                  pagePrevText="«"
                  pageNextText="»"
                /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ShopGridStandard;

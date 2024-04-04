import { HttpError, useGetIdentity, useList } from "@refinedev/core";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import { Pagination, PaginationProps, Popover, Segmented, Spin } from "antd";
import { SegmentedValue } from "antd/es/segmented";
import { SegmentedProps } from "antd/lib";
import dayjs from "dayjs";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { CurrencyFormatter } from "../../helpers/currency";
import { ICustomerResponse, IOrderResponse } from "../../interfaces";
import { RootState } from "../../redux/store";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";

const MyOrders = () => {
  const { t } = useTranslation();

  const setTitle = useDocumentTitle();

  useEffect(() => {
    setTitle(t("nav.pages.wishlist") + " | SUNS");
  }, [t]);

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
  const pageLimit: number = 5;
  const currentPage = Number(searchParams.get("page")) || 1;

  const onChange: PaginationProps["onChange"] = (page) => {
    setSearchParams((prev: URLSearchParams) => {
      prev.set("page", page.toString());
      return prev;
    });
  };

  let { pathname } = useLocation();

  const currency = useSelector((state: RootState) => state.currency);

  const [selectedOption, setSelectedOption] = useState<string | number>("");

  const options: SegmentedProps["options"] = [
    {
      label: t("my_order.segmented.options.ALL"),
      value: "",
    },
    {
      label: t("my_order.segmented.options.WAIT_FOR_CONFIRMATION"),
      value: "WAIT_FOR_CONFIRMATION",
    },
    {
      label: t("my_order.segmented.options.WAIT_FOR_DELIVERY"),
      value: "WAIT_FOR_DELIVERY",
    },
    {
      label: t("my_order.segmented.options.DELIVERING"),
      value: "DELIVERING",
    },
    {
      label: t("my_order.segmented.options.COMPLETED"),
      value: "COMPLETED",
    },
    {
      label: t("my_order.segmented.options.CANCELED"),
      value: "CANCELED",
    },
  ];

  const { data: user, refetch } = useGetIdentity<ICustomerResponse>();

  const { data, isLoading, isError } = useList<IOrderResponse, HttpError>({
    resource: "orders",
    pagination: {
      pageSize: pageLimit,
      current: currentPage,
    },
    filters: [
      {
        field: "customer",
        operator: "eq",
        value: user?.id,
      },
      {
        field: "status",
        operator: "eq",
        value: selectedOption,
      },
    ],
  });

  useEffect(() => {
    if (data?.data) {
      setTotalElements(data.total);
    }
  }, [data]);

  const orders = data?.data ?? [];

  return (
    <Fragment>
      <Breadcrumb
        pages={[
          { label: "home", path: "/" },
          { label: "pages.my_orders", path: pathname },
        ]}
      />
      <div className="cart-main-area pt-90 pb-100 bg-white">
        <div className="container">
          <Fragment>
            <div className="row mb-2">
              <div className="col-md-3">
                <h3 className="cart-page-title">{t("my_order.title")}</h3>
              </div>
              <div className="col-md-9">
                <Segmented
                  block
                  options={options}
                  onChange={(value: SegmentedValue) => setSelectedOption(value)}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="table-content table-responsive cart-table-content">
                  <Spin spinning={isLoading}>
                    <table className="w-100">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>{t("my_order.fields.code")}</th>
                          <th>{t("my_order.fields.total")}</th>
                          <th>{t("my_order.fields.product")}</th>
                          <th>{t("my_order.fields.createdAt")}</th>
                        </tr>
                      </thead>
                      {orders && orders.length >= 1 && (
                        <tbody>
                          {orders.map((item, index) => {
                            const orderDetails = item?.orderDetails || [];
                            const totalQuantity = orderDetails.reduce(
                              (total, orderDetail) => {
                                return total + orderDetail.quantity;
                              },
                              0
                            );

                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>

                                <td className="text-center fw-bold">
                                  <Link to={item.id}>{item.code}</Link>
                                </td>

                                <td className="product-price-cart">
                                  <CurrencyFormatter
                                    className="amount"
                                    value={
                                      item.totalMoney * currency.currencyRate
                                    }
                                    currency={currency}
                                  />
                                </td>

                                <td className="product-wishlist-cart">
                                  <Popover
                                    content={
                                      <ul>
                                        {item.orderDetails.map(
                                          (orderDetail) => (
                                            <li key={orderDetail.id}>
                                              {
                                                orderDetail.productDetail
                                                  .product.name
                                              }{" "}
                                              -{" "}
                                              {
                                                orderDetail.productDetail.color
                                                  .name
                                              }{" "}
                                              -{" "}
                                              {
                                                orderDetail.productDetail.size
                                                  .name
                                              }{" "}
                                              - x{orderDetail.quantity}
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    }
                                    title={t("my_order.fields.product")}
                                    trigger="hover"
                                  >
                                    {totalQuantity}{" "}
                                    {t("my_order.fields.product")}
                                  </Popover>
                                </td>

                                <td className="product-remove">
                                  {dayjs(new Date(item.createdAt)).format(
                                    "DD/MM/YYYY hh:mm"
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      )}
                      <tfoot></tfoot>
                    </table>
                    <div className="pro-pagination-style text-center mt-30 mb-3q">
                      {/* Pagination */}
                      <Pagination
                        current={currentPage}
                        total={totalElements}
                        showSizeChanger={false}
                        onChange={onChange}
                      />
                    </div>
                  </Spin>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-12">
                <div className="cart-shiping-update-wrapper">
                  <div className="cart-shiping-update">
                    <Link to={"/shop"}>
                      {t(`wish_list.buttons.continue_shopping`)}
                    </Link>
                  </div>
                  <div className="cart-clear">
                    <Link to={"/tracking"}>
                      {t("my_order.buttons.tracking")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Fragment>
        </div>
      </div>
    </Fragment>
  );
};

export default MyOrders;

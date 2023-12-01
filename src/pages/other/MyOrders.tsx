import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { getDiscountPrice } from "../../helpers/product";
import {
  deleteAllFromWishlist,
  deleteFromWishlist,
} from "../../redux/slices/wishlist-slice";
import { RootState } from "../../redux/store";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import { HttpError, useGetIdentity, useList } from "@refinedev/core";
import { ICustomerResponse, IOrderResponse } from "../../interfaces";
import { Popover } from "antd";
import dayjs from "dayjs";

const MyOrders = () => {
  const { t } = useTranslation();

  useDocumentTitle(t("nav.pages.wishlist") + " | SUNS");

  const dispatch = useDispatch();
  let { pathname } = useLocation();

  const currency = useSelector((state: RootState) => state.currency);

  const { data: user, refetch } = useGetIdentity<ICustomerResponse>();

  const { data, isLoading, isError } = useList<IOrderResponse, HttpError>({
    resource: "order",
    pagination: {
      pageSize: 1000,
    },
    filters: [
      {
        field: "customer",
        operator: "eq",
        value: user?.id,
      },
    ],
  });

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
          {orders && orders.length >= 1 ? (
            <Fragment>
              <h3 className="cart-page-title">{t(`wish_list.title`)}</h3>
              <div className="row">
                <div className="col-12">
                  <div className="table-content table-responsive cart-table-content">
                    <table>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Mã</th>
                          <th>Tổng cộng</th>
                          <th>Sản phẩm</th>
                          <th>Tạo lúc</th>
                        </tr>
                      </thead>
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
                              <td className="product-thumbnail">{index}</td>

                              <td className="product-name text-center">
                                <Link to={"/product/" + item.id}>
                                  {item.code}
                                </Link>
                              </td>

                              <td className="product-price-cart">
                                <span className="amount">
                                  {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: currency.currencyName,
                                    currencyDisplay: "symbol",
                                  }).format(Number(item.totalMoney))}
                                </span>
                              </td>

                              <td className="product-wishlist-cart">
                                <Popover
                                  content={
                                    <ul>
                                      {item.orderDetails.map((orderDetail) => (
                                        <li key={orderDetail.id}>
                                          {
                                            orderDetail.productDetail.product
                                              .name
                                          }{" "}
                                          -{" "}
                                          {orderDetail.productDetail.color.name}{" "}
                                          -{" "}
                                          {orderDetail.productDetail.size.name}{" "}
                                          - x{orderDetail.quantity}
                                        </li>
                                      ))}
                                    </ul>
                                  }
                                  title="Sản phẩm"
                                  trigger="hover"
                                >
                                  {totalQuantity} sản phẩm
                                </Popover>
                              </td>

                              <td className="product-remove">
                                {dayjs(new Date(item.createdAt)).format(
                                  "DD/MM/YYY"
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
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
                      <button onClick={() => dispatch(deleteAllFromWishlist())}>
                        {t(`wish_list.buttons.clear_wishlist`)}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Fragment>
          ) : (
            <div className="row">
              <div className="col-lg-12">
                <div className="item-empty-area text-center">
                  <div className="item-empty-area__icon mb-30">
                    <i className="pe-7s-like"></i>
                  </div>
                  <div className="item-empty-area__text">
                    {t(`wish_list.no_items_found`)}
                    <br />{" "}
                    <Link to={"/shop"}>{t(`wish_list.buttons.add_items`)}</Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default MyOrders;

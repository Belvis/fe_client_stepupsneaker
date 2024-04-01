import {
  CarOutlined,
  CheckOutlined,
  DropboxOutlined,
  FileProtectOutlined,
  LoadingOutlined,
  QuestionOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { useModal } from "@refinedev/antd";
import { HttpError, useOne } from "@refinedev/core";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import { Button, Flex, Grid, Space, Spin, Steps, Tooltip } from "antd";
import dayjs from "dayjs";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import CancelReasonModal from "../../components/order/CancelReasonModal";
import MyOrderModal from "../../components/order/MyOrderModal";
import { CurrencyFormatter } from "../../helpers/currency";
import { IEvent, IOrderResponse, OrderStatus } from "../../interfaces";
import { RootState } from "../../redux/store";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { FREE_SHIPPING_THRESHOLD } from "../../constants";

const { useBreakpoint } = Grid;

const InitialEventData: IEvent[] = [
  {
    date: undefined,
    status: "PLACE_ORDER",
  },
  {
    date: undefined,
    status: "WAIT_FOR_CONFIRMATION",
  },
  {
    date: undefined,
    status: "WAIT_FOR_DELIVERY",
  },
  {
    date: undefined,
    status: "DELIVERING",
  },
  {
    date: undefined,
    status: "COMPLETED",
  },
];

const OrderTracking = () => {
  const { t } = useTranslation();

  const setTitle = useDocumentTitle();

  useEffect(() => {
    setTitle(t("nav.pages.orders_tracking") + " | SUNS");
  }, [t]);

  let { pathname } = useLocation();

  let { code } = useParams();

  const screens = useBreakpoint();
  const currentBreakPoints = Object.entries(screens)
    .filter((screen) => !!screen[1])
    .map((screen) => screen[0]);

  const { data, isLoading, isError, refetch } = useOne<
    IOrderResponse,
    HttpError
  >({
    resource: "orders/tracking",
    id: code,
  });

  const order = data?.data ? data?.data : ({} as IOrderResponse);

  const currency = useSelector((state: RootState) => state.currency);

  const {
    show,
    close,
    modalProps: { visible, ...restModalProps },
  } = useModal();

  const {
    show: showCancel,
    close: closeCancle,
    modalProps: { visible: vi, ...restProps },
  } = useModal();

  const [events, setEvents] = useState<IEvent[]>(InitialEventData);

  const getIconByStatus = (status: OrderStatus) => {
    switch (status) {
      case "PLACE_ORDER":
        return <DropboxOutlined />;
      case "WAIT_FOR_CONFIRMATION":
        return <QuestionOutlined />;
      case "WAIT_FOR_DELIVERY":
        return <CheckOutlined />;
      case "DELIVERING":
        return <CarOutlined />;
      case "COMPLETED":
        return <FileProtectOutlined />;
      case "RETURNED":
        return <StopOutlined />;
      default:
        return null;
    }
  };
  useEffect(() => {
    if (
      order &&
      order.orderHistories &&
      order.orderHistories.length > 0 &&
      !isError
    ) {
      const updatedEvents = InitialEventData.map((event) => {
        switch (event.status) {
          case "PLACE_ORDER":
            return {
              ...event,
              date: order.createdAt,
            };
          case "COMPLETED":
            const canceledReturnedOrExchangedOrder = order.orderHistories.find(
              (orderHistory) =>
                ["CANCELED", "RETURNED", "EXCHANGED"].includes(
                  orderHistory.actionStatus
                )
            );
            if (canceledReturnedOrExchangedOrder) {
              return {
                ...event,
                status: canceledReturnedOrExchangedOrder.actionStatus,
                date: canceledReturnedOrExchangedOrder.createdAt,
              };
            }
            {
              const matchedOrderHistory = order.orderHistories.find(
                (orderHistory) => orderHistory.actionStatus === event.status
              );
              if (matchedOrderHistory) {
                return {
                  ...event,
                  date: matchedOrderHistory.createdAt,
                };
              }
            }
          default:
            const matchedOrderHistory = order.orderHistories.find(
              (orderHistory) => orderHistory.actionStatus === event.status
            );
            if (matchedOrderHistory) {
              return {
                ...event,
                date: matchedOrderHistory.createdAt,
              };
            }
        }
        return event;
      });

      setEvents(updatedEvents);
    }
  }, [order]);

  const renderOrderSteps = () => {
    const notFinishedCurrentStep = (event: IEvent, index: number) =>
      event.status !== "CANCELED" &&
      event.status !== "COMPLETED" &&
      event.status !== "RETURNED" &&
      events.findIndex((el) => el.status === order?.status) === index;

    const stepStatus = (event: IEvent, index: number) => {
      if (!event.date) return "wait";
      if (
        event.status === "CANCELED" ||
        (event.status === "RETURNED" && index === events.length - 1)
      )
        return "error";
      if (notFinishedCurrentStep(event, index)) return "process";
      return "finish";
    };

    return (
      <Steps
        direction={
          currentBreakPoints.includes("lg") ? "horizontal" : "vertical"
        }
        current={events.findIndex((el) => el.status === order?.status)}
        type={currentBreakPoints.includes("lg") ? "navigation" : "default"}
      >
        {events.map((event: IEvent, index: number) => (
          <Steps.Step
            status={stepStatus(event, index)}
            key={index}
            title={t(`order_tracking.steps.${event.status}.title`)}
            description={t(`order_tracking.steps.${event.status}.description`)}
            subTitle={
              <Tooltip
                title={event.date && dayjs(new Date(event.date)).format("LLL")}
              >
                {event.date && dayjs(new Date(event.date)).format("DD/MM/YYYY")}
              </Tooltip>
            }
            icon={
              notFinishedCurrentStep(event, index) ? (
                <LoadingOutlined />
              ) : (
                getIconByStatus(event.status)
              )
            }
          />
        ))}
      </Steps>
    );
  };

  return (
    <Fragment>
      <Breadcrumb
        pages={[
          { label: "home", path: "/" },
          { label: "pages.orders", path: "/pages/my-account/orders" },
          { label: "pages.orders_tracking", path: pathname },
        ]}
      />
      <Spin spinning={isLoading}>
        <div className="bg-white p-100">
          <Flex gap="middle" align="center" justify="space-between">
            <h3>Trạng thái đơn hàng: #{order && order.code}</h3>
            <Space>
              <Button
                disabled={order.status !== "WAIT_FOR_CONFIRMATION"}
                onClick={showCancel}
              >
                Huỷ
              </Button>
              <Button
                disabled={order.status !== "WAIT_FOR_CONFIRMATION"}
                onClick={show}
              >
                Sửa đơn hàng
              </Button>
            </Space>
          </Flex>
          <hr />
          <div className="table-content table-responsive order-tracking-table-content">
            <table className="w-100">
              <tbody>
                <tr>
                  <td className="field">
                    <p>Số điện thoại khách hàng</p>
                  </td>
                  <td className="value">
                    <p>{order.phoneNumber}</p>
                  </td>
                </tr>
                <tr>
                  <td className="field">
                    <p>Ngày đặt hàng</p>
                  </td>
                  <td className="value">
                    <p>{dayjs(new Date(order.createdAt)).format("LLL")}</p>
                  </td>
                </tr>
                <tr>
                  <td className="field">
                    <p>Ngày dự kiến giao hàng</p>
                  </td>
                  <td className="value">
                    <p>
                      {dayjs(new Date(order.expectedDeliveryDate)).format(
                        "LLL"
                      )}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="field">
                    <p>Địa chỉ giao hàng</p>
                  </td>
                  <td className="value">
                    <p>
                      {order.address &&
                        `${order.address.more}, ${order.address.wardName}, ${order.address.districtName}, ${order.address.provinceName}`}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <hr />
          {renderOrderSteps()}
          <h3 className="cart-page-title mt-3">Đơn đặt hàng</h3>
          <div className="order-summary table-content table-responsive order-tracking-table-content ">
            <table className="w-100">
              <thead>
                <tr>
                  <th style={{ textAlign: "start" }}>Sản phẩm</th>
                  <th style={{ textAlign: "end" }}>
                    {t(`cart.table.head.subtotal`)}
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.orderDetails &&
                  order.orderDetails.length > 0 &&
                  order.orderDetails.map((detail, key) => {
                    return (
                      <tr key={key}>
                        <td className="product">
                          <div className="row">
                            <div className="product-thumbnail col-3">
                              <Link to={"/product/" + detail.id}>
                                <img
                                  className="img-fluid"
                                  src={detail.productDetail.image}
                                  alt=""
                                />
                              </Link>
                            </div>
                            <div className="cart-item-variation col-9">
                              <span>
                                {t(`cart.table.head.product_name`)}:{" "}
                                <Link to={"/product/" + detail.id}>
                                  {detail.productDetail.product.name}
                                </Link>
                              </span>
                              <span>
                                {t(`cart.table.head.color`)}:{" "}
                                {detail.productDetail.color.name}
                              </span>
                              <span>
                                {t(`cart.table.head.size`)}:{" "}
                                {detail.productDetail.size.name}
                              </span>
                              <span>
                                {t(`cart.table.head.qty`)}: {detail.quantity}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="product-subtotal value">
                          <CurrencyFormatter
                            className="amount"
                            value={detail.totalPrice}
                            currency={currency}
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan={2} style={{ textAlign: "end" }}>
                    <div className="row">
                      <div className="col-9">
                        <h5>{t(`cart.cart_total.total`)} </h5>
                      </div>
                      <div className="col-3">
                        <CurrencyFormatter
                          className="amount"
                          value={order.originMoney}
                          currency={currency}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-9">
                        <h5>{t(`cart.cart_total.shipping`)} </h5>
                      </div>
                      <div className="col-3">
                        {order.originMoney < FREE_SHIPPING_THRESHOLD ? (
                          <CurrencyFormatter
                            className="amount"
                            value={order.shippingMoney}
                            currency={currency}
                          />
                        ) : (
                          <span className="free-shipping">
                            Miễn phí vận chuyển
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-9">
                        <h5>Giảm giá</h5>
                      </div>
                      <div className="col-3">
                        <CurrencyFormatter
                          className="amount"
                          value={order.reduceMoney}
                          currency={currency}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-9">
                        <h4 className="grand-total-title">
                          {t(`cart.cart_total.grand_total`)}{" "}
                        </h4>
                      </div>
                      <div className="col-3">
                        <CurrencyFormatter
                          className="amount"
                          value={order.totalMoney}
                          currency={currency}
                        />
                      </div>
                    </div>
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="order-code text-center mt-5">
            <Link to={"/return/" + order.id}>Tạo phiếu hoàn trả</Link>
            <p>Trả hàng sẽ hết hạn vào 2021-03-30</p>
          </div>
        </div>
      </Spin>
      <MyOrderModal
        restModalProps={restModalProps}
        close={close}
        showCancel={showCancel}
        order={order}
        callBack={refetch}
      />
      <CancelReasonModal
        restModalProps={restProps}
        close={closeCancle}
        code={code}
        callBack={refetch}
      />
    </Fragment>
  );
};

export default OrderTracking;

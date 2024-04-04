import { useModal } from "@refinedev/antd";
import { useTranslate } from "@refinedev/core";
import { Button, Flex, Space } from "antd";
import dayjs from "dayjs";
import React, { Fragment } from "react";
import { IOrderResponse } from "../../interfaces";
import CancelReasonModal from "./CancelReasonModal";
import MyOrderModal from "./MyOrderModal";

interface OrderInfoProps {
  order: IOrderResponse;
  refetch: any;
}

const OrderInfo: React.FC<OrderInfoProps> = ({ order, refetch }) => {
  const t = useTranslate();

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

  return (
    <Fragment>
      <Flex gap="middle" align="center" justify="space-between">
        <h3>
          {t("order_tracking.title")}: #{order && order.code}
        </h3>
        <Space>
          <Button
            disabled={order.status !== "WAIT_FOR_CONFIRMATION"}
            onClick={showCancel}
          >
            {t("order_tracking.buttons.cancel")}
          </Button>
          <Button
            disabled={order.status !== "WAIT_FOR_CONFIRMATION"}
            onClick={show}
          >
            {t("order_tracking.buttons.edit")}
          </Button>
        </Space>
      </Flex>
      <hr />
      <div className="table-content table-responsive order-tracking-table-content">
        <table className="w-100">
          <tbody>
            <tr>
              <td className="field">
                <p>{t("order_tracking.fields.phoneNumber")}</p>
              </td>
              <td className="value">
                <p>{order.phoneNumber}</p>
              </td>
            </tr>
            <tr>
              <td className="field">
                <p>{t("order_tracking.fields.date")}</p>
              </td>
              <td className="value">
                <p>{dayjs(new Date(order.createdAt)).format("LLL")}</p>
              </td>
            </tr>
            <tr>
              <td className="field">
                <p>{t("order_tracking.fields.expectedDelivery")}</p>
              </td>
              <td className="value">
                <p>
                  {dayjs(new Date(order.expectedDeliveryDate)).format("LLL")}
                </p>
              </td>
            </tr>
            <tr>
              <td className="field">
                <p>{t("order_tracking.fields.address")}</p>
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
        code={order.code}
        callBack={refetch}
      />
    </Fragment>
  );
};

export default OrderInfo;

import { HttpError, useOne } from "@refinedev/core";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import { Spin } from "antd";
import { Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import OrderDeliverables from "../../components/order/OrderDeliverables";
import OrderInfo from "../../components/order/OrderInfo";
import { OrderSteps } from "../../components/order/OrderSteps";
import { IOrderResponse } from "../../interfaces";
import { RootState } from "../../redux/store";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { Accordion } from "react-bootstrap";
import OrderReviews from "../../components/order/OrderReviews";

const OrderDetail = () => {
  const { t } = useTranslation();

  const setTitle = useDocumentTitle();

  useEffect(() => {
    setTitle(t("nav.pages.orders_tracking") + " | SUNS");
  }, [t]);

  let { pathname } = useLocation();

  let { id } = useParams();

  const { data, isLoading, isError, refetch } = useOne<
    IOrderResponse,
    HttpError
  >({
    resource: "orders",
    id: id,
  });

  const order = data?.data;

  const currency = useSelector((state: RootState) => state.currency);

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
          {order && (
            <Fragment>
              <OrderInfo order={order} refetch={refetch} />
              <OrderSteps record={order} callBack={refetch} />
              <OrderDeliverables order={order} currency={currency} />
              {order.status === "COMPLETED" && (
                <Accordion defaultActiveKey="0">
                  <OrderReviews order={order} callBack={refetch} />
                </Accordion>
              )}
            </Fragment>
          )}
        </div>
      </Spin>
    </Fragment>
  );
};

export default OrderDetail;

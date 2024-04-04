import { HttpError, useOne } from "@refinedev/core";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import { Spin } from "antd";
import { Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import OrderDeliverables from "../../components/order/OrderDeliverables";
import OrderInfo from "../../components/order/OrderInfo";
import { OrderSteps } from "../../components/order/OrderSteps";
import { IOrderResponse } from "../../interfaces";
import { RootState } from "../../redux/store";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import dayjs from "dayjs";

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

  const returnedHistory = order?.orderHistories.find(
    (history) => history.actionStatus === "RETURNED"
  );

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
              {returnedHistory ? (
                <div className="order-code text-center mt-5">
                  <Link to={"/pages/my-account/returns/" + order?.id}>
                    {t("order_tracking.buttons.track_return_form")}
                  </Link>
                </div>
              ) : (
                <div className="order-code text-center mt-5">
                  <Link to={"/return/" + order?.id}>
                    {t("order_tracking.buttons.create_return_form.label")}
                  </Link>
                  <p>
                    {t(
                      "order_tracking.buttons.create_return_form.description",
                      {
                        date: dayjs(new Date(order?.receivedDate))
                          .add(7, "day")
                          .format("LLL"),
                      }
                    )}{" "}
                  </p>
                </div>
              )}
            </Fragment>
          )}
        </div>
      </Spin>
    </Fragment>
  );
};

export default OrderDetail;

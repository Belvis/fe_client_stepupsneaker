import {
  CarFilled,
  CaretLeftOutlined,
  CreditCardFilled,
  HomeFilled,
  PrinterOutlined,
} from "@ant-design/icons";
import { HttpError, useGetIdentity, useOne } from "@refinedev/core";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import { Result, Spin } from "antd";
import dayjs from "dayjs";
import { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import { FREE_SHIPPING_THRESHOLD } from "../../constants";
import { CurrencyFormatter } from "../../helpers/currency";
import { ICustomerResponse, IOrderResponse } from "../../interfaces";
import { AppDispatch, RootState } from "../../redux/store";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import {
  deleteAllByOrderFromDB,
  deleteCartItemsByOrder,
} from "../../redux/slices/cart-slice";
import { InvoiceTemplate } from "../../template/InvoiceTemplate";
import { useReactToPrint } from "react-to-print";

const Success = () => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const { data: user, refetch } = useGetIdentity<ICustomerResponse>();

  const setTitle = useDocumentTitle();

  useEffect(() => {
    setTitle(t("nav.pages.success") + " | SUNS");
  }, [t]);

  let { pathname } = useLocation();

  let { id } = useParams();

  const [printOrder, setPrintOrder] = useState<IOrderResponse | undefined>();

  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    if (printOrder && componentRef.current) {
      handlePrint();
      setPrintOrder(undefined);
    }
  }, [printOrder, componentRef.current]);

  const { data, isLoading, isError } = useOne<IOrderResponse, HttpError>({
    resource: "orders",
    id: id,
  });

  const order = data?.data;

  useEffect(() => {
    if (cartItems && cartItems.length > 0 && order?.id) {
      if (user) {
        dispatch(deleteAllByOrderFromDB(order.id));
        dispatch(deleteCartItemsByOrder(order.id));
      } else {
        dispatch(deleteCartItemsByOrder(order.id));
      }
    }
  }, [order, user]);

  const currency = useSelector((state: RootState) => state.currency);

  return (
    <Fragment>
      <Breadcrumb
        pages={[
          { label: "home", path: "/" },
          { label: "pages.checkout", path: "/checkout" },
          { label: "pages.success", path: pathname },
        ]}
      />

      <Spin spinning={isLoading}>
        {order ? (
          <div
            className="success-area pb-80 bg-white"
            style={{ padding: "80px 30px 100px 30px" }}
          >
            <Result
              status="success"
              title={t("success_page.title")}
              subTitle={
                <div>
                  <p>{t("success_page.subtitle.email")}</p>
                  <p>{t("success_page.subtitle.contact")}</p>
                  <div className="order-code">
                    <Link to={"/tracking/" + order.code}>
                      {t("success_page.subtitle.code")}: {order.code}
                    </Link>
                  </div>
                  <p>
                    {t("success_page.subtitle.date")}:{" "}
                    {dayjs(new Date(order.createdAt ?? 0)).format("DD/MM/YYYY")}
                  </p>
                </div>
              }
              extra={[
                <Link className="order-nav" to={`/shop`}>
                  <CaretLeftOutlined /> {t(`cart.buttons.continue_shopping`)}
                </Link>,
                <Link
                  className="order-nav"
                  to=""
                  onClick={() => {
                    setPrintOrder(order);
                  }}
                >
                  <PrinterOutlined /> {t("success_page.extra.print")}
                </Link>,
              ]}
            />
            <div className="row ">
              <div className="col-lg-6 col-md-6">
                <div className="row">
                  <div className="col-lg-6 col-md-6 mb-4">
                    <div className="table-content table-responsive order-tracking-table-content">
                      <table className="w-100">
                        <thead>
                          <tr>
                            <th style={{ textAlign: "start" }}>
                              <HomeFilled />{" "}
                              {t("success_page.address.shipping")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="field">
                              {order.address && (
                                <>
                                  <p>
                                    {t("success_page.address.province.title")}:{" "}
                                    {order.address.provinceName}
                                  </p>
                                  <p>
                                    {t("success_page.address.district.title")}:{" "}
                                    {order.address.districtName}
                                  </p>
                                  <p>
                                    {t("success_page.address.ward.title")}:{" "}
                                    {order.address.wardName}
                                  </p>
                                  <p>
                                    {t("success_page.address.phoneNumber")}:{" "}
                                    {order.address.phoneNumber}
                                  </p>
                                  <p>
                                    {t("success_page.address.line")}:{" "}
                                    {order.address.more}
                                  </p>
                                </>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 mb-4">
                    <div className="table-content table-responsive order-tracking-table-content">
                      <table className="w-100">
                        <thead>
                          <tr>
                            <th style={{ textAlign: "start" }}>
                              <HomeFilled /> {t("success_page.address.order")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="field">
                              {order.address &&
                              order.customer &&
                              order.customer.addressList.length > 0 ? (
                                <>
                                  <p>
                                    {t("success_page.address.province.title")}:{" "}
                                    {order.customer.addressList[0].provinceName}
                                  </p>
                                  <p>
                                    {t("success_page.address.district.title")}:{" "}
                                    {order.customer.addressList[0].districtName}
                                  </p>
                                  <p>
                                    {t("success_page.address.ward.title")}:{" "}
                                    {order.customer.addressList[0].wardName}
                                  </p>
                                  <p>
                                    {t("success_page.address.phoneNumber")}:{" "}
                                    {order.customer.addressList[0].phoneNumber}
                                  </p>
                                  <p>
                                    {t("success_page.address.line")}:{" "}
                                    {order.customer.addressList[0].more}
                                  </p>
                                </>
                              ) : (
                                <p>
                                  {t(
                                    "common.retail_customer",
                                    "Retail customer"
                                  )}
                                </p>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6 col-md-6 mb-4">
                    <div className="table-content table-responsive order-tracking-table-content">
                      <table>
                        <thead>
                          <tr>
                            <th style={{ textAlign: "start" }}>
                              <CarFilled /> {t("success_page.shipping_method")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="field">
                              {t("success_page.giaohangtietkiem")}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-6 mb-4">
                    <div className="table-content table-responsive order-tracking-table-content">
                      <table>
                        <thead>
                          <tr>
                            <th style={{ textAlign: "start" }}>
                              <CreditCardFilled />{" "}
                              {t("success_page.payment_method")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="field">
                              {order?.payments &&
                                order.payments.map((payment, index) => (
                                  <span key={index}>
                                    {t(
                                      `success.payment.methods.options.${payment.paymentMethod.name}`
                                    )}{" "}
                                    - {t("success.payment.transaction_code")}
                                    {": "}
                                    {payment.transactionCode}
                                    {index < order.payments.length - 1
                                      ? ", "
                                      : ""}
                                  </span>
                                ))}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 order-summary table-content table-responsive order-tracking-table-content ">
                <table className="w-100">
                  <thead>
                    <tr>
                      <th style={{ textAlign: "start" }}>
                        {t("my_order.fields.product")}
                      </th>
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
                                  <Link
                                    to={
                                      "/product/" +
                                      detail.productDetail.product.id
                                    }
                                  >
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
                                    <Link
                                      to={
                                        "/product/" +
                                        detail.productDetail.product.id
                                      }
                                      className="fw-bold"
                                    >
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
                                    {t(`cart.table.head.qty`)}:{" "}
                                    {detail.quantity}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="value">
                              <CurrencyFormatter
                                className="amount"
                                value={
                                  detail.totalPrice * currency.currencyRate
                                }
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
                          <div className="col-8">
                            <h5>{t(`cart.cart_total.total`)} </h5>
                          </div>
                          <div className="col-4">
                            <CurrencyFormatter
                              value={order.originMoney * currency.currencyRate}
                              currency={currency}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-8">
                            <h5>{t(`cart.cart_total.shipping`)} </h5>
                          </div>
                          <div className="col-4">
                            {order.originMoney >= FREE_SHIPPING_THRESHOLD ? (
                              <span className="free-shipping">
                                {t("common.free_shipping")}
                              </span>
                            ) : (
                              <CurrencyFormatter
                                value={
                                  order.shippingMoney * currency.currencyRate
                                }
                                currency={currency}
                              />
                            )}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-8">
                            <h5>{t("cart.voucher.voucher")}</h5>
                          </div>
                          <div className="col-4">
                            <CurrencyFormatter
                              value={order.reduceMoney * currency.currencyRate}
                              currency={currency}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-8">
                            <h4 className="grand-total-title">
                              {t(`cart.cart_total.grand_total`)}{" "}
                            </h4>
                          </div>
                          <div className="col-4">
                            <CurrencyFormatter
                              value={order.totalMoney * currency.currencyRate}
                              currency={currency}
                            />
                          </div>
                        </div>
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </Spin>
      <div className="d-none" key={printOrder?.id}>
        {printOrder && (
          <InvoiceTemplate
            key={printOrder.id || Date.now()}
            order={printOrder}
            ref={componentRef}
          />
        )}
      </div>
    </Fragment>
  );
};

export default Success;

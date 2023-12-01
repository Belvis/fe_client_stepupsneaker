import {
  CarFilled,
  CaretLeftOutlined,
  CreditCardFilled,
  HomeFilled,
  PrinterOutlined,
} from "@ant-design/icons";
import { HttpError, useOne } from "@refinedev/core";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import { Result } from "antd";
import dayjs from "dayjs";
import { Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import { getDiscountPrice } from "../../helpers/product";
import { IOrderResponse } from "../../interfaces";
import { RootState } from "../../redux/store";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { clearOrder } from "../../redux/slices/order-slice";
import { deleteAllFromCart } from "../../redux/slices/cart-slice";

const Success = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useDocumentTitle(t("nav.pages.success") + " | SUNS");

  let { pathname } = useLocation();

  let { id } = useParams();

  const { data, isLoading, isError } = useOne<IOrderResponse, HttpError>({
    resource: "orders",
    id: id,
  });

  const order = data?.data ? data?.data : ({} as IOrderResponse);

  const currency = useSelector((state: RootState) => state.currency);

  let cartTotalPrice = 0;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Something went wrong!</div>;
  }

  return (
    <Fragment>
      <Breadcrumb
        pages={[
          { label: "home", path: "/" },
          { label: "pages.checkout", path: "/checkout" },
          { label: "pages.success", path: pathname },
        ]}
      />

      <div
        className="success-area pb-80 bg-white"
        style={{ padding: "80px 30px 100px 30px" }}
      >
        <Result
          status="success"
          title="Cảm ơn bạn đã mua hàng!"
          subTitle={
            <div>
              <p>
                Email xác nhận đơn hàng với chi tiết đơn hàng của bạn và một
                liên kết để theo dõi tiến trình đã được gửi đến địa chỉ email
                của bạn.
              </p>
              <p>Chúng tôi sẽ liên hệ với bạn trong 24h, xin hãy chờ đợi.</p>
              <div className="order-code">
                <Link to={"/orders/tracking/" + order.code}>
                  Mã đơn hàng: {order.code.toUpperCase()}
                </Link>
              </div>
              <p>
                Ngày mua hàng:{" "}
                {dayjs(new Date(order.createdAt ?? 0)).format("DD/MM/YYYY")}
              </p>
            </div>
          }
          extra={[
            <Link className="order-nav" to={`/shop`}>
              <CaretLeftOutlined /> Tiếp tục mua sắm
            </Link>,
            <Link className="order-nav" to={`/shop`}>
              <PrinterOutlined /> In hoá đơn
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
                          <HomeFilled /> Địa chỉ giao hàng
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="field">
                          {order.address && (
                            <>
                              <p>
                                Tỉnh/thành phố: {order.address.provinceName}
                              </p>
                              <p>Quận/huyện: {order.address.districtName}</p>
                              <p>Phường/xã: {order.address.wardName}</p>
                              <p>Số điện thoại: {order.address.phoneNumber}</p>
                              <p>Địa chỉ chi tiết: {order.address.more}</p>
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
                          <HomeFilled /> Địa chỉ hóa đơn
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="field">
                          {order.address &&
                            order.customer &&
                            order.customer.addressList.length > 0 && (
                              <>
                                <p>
                                  Tỉnh/thành phố:{" "}
                                  {order.customer.addressList[0].provinceName}
                                </p>
                                <p>
                                  Quận/huyện:{" "}
                                  {order.customer.addressList[0].districtName}
                                </p>
                                <p>
                                  Phường/xã:{" "}
                                  {order.customer.addressList[0].wardName}
                                </p>
                                <p>
                                  Số điện thoại:{" "}
                                  {order.customer.addressList[0].phoneNumber}
                                </p>
                                <p>
                                  Địa chỉ chi tiết:{" "}
                                  {order.customer.addressList[0].more}
                                </p>
                              </>
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
                          <CarFilled /> Phương thức vận chuyển
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="field">Giao hàng tiết kiệm</td>
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
                          <CreditCardFilled /> Phương thức thanh toán
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
                                {index < order.payments.length - 1 ? ", " : ""}
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
                    const discountedPrice = getDiscountPrice(
                      detail?.totalPrice ?? 0,
                      0
                    );
                    const finalProductPrice = (
                      (detail?.totalPrice ?? 0) * currency.currencyRate
                    ).toFixed(2);
                    const finalDiscountedPrice =
                      discountedPrice !== null
                        ? parseFloat(
                            (discountedPrice * currency.currencyRate).toFixed(2)
                          )
                        : 0.0;

                    discountedPrice !== null
                      ? (cartTotalPrice +=
                          finalDiscountedPrice * detail.quantity)
                      : (cartTotalPrice +=
                          parseFloat(finalProductPrice) * detail.quantity);

                    return (
                      <tr key={key}>
                        <td className="product">
                          <div className="row">
                            <div className="product-thumbnail col-3">
                              <Link
                                to={
                                  "/product/" + detail.productDetail.product.id
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
                        <td className="value">
                          {discountedPrice !== null ? (
                            <span className="amount">
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: currency.currencyName,
                                currencyDisplay: "symbol",
                              }).format(
                                Number(finalDiscountedPrice) * detail.quantity
                              )}
                            </span>
                          ) : (
                            <span className="amount">
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: currency.currencyName,
                                currencyDisplay: "symbol",
                              }).format(
                                Number(finalProductPrice) * detail.quantity
                              )}
                            </span>
                          )}
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
                        <span>
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: currency.currencyName,
                            currencyDisplay: "symbol",
                          }).format(Number(cartTotalPrice.toFixed(2)))}
                        </span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-9">
                        <h5>{t(`cart.cart_total.shipping`)} </h5>
                      </div>
                      <div className="col-3">
                        <span>
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: currency.currencyName,
                            currencyDisplay: "symbol",
                          }).format(order.shippingMoney)}
                        </span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-9">
                        <h5>Giảm giá</h5>
                      </div>
                      <div className="col-3">
                        <span>
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: currency.currencyName,
                            currencyDisplay: "symbol",
                          }).format(
                            order.voucher
                              ? order.voucher.type == "PERCENTAGE"
                                ? (order.voucher.value / 100) *
                                  Number(order.totalMoney.toFixed(2))
                                : order.voucher.value
                              : 0
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-9">
                        <h4 className="grand-totall-title">
                          {t(`cart.cart_total.grand_total`)}{" "}
                        </h4>
                      </div>
                      <div className="col-3">
                        <span>
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: currency.currencyName,
                            currencyDisplay: "symbol",
                          }).format(order.totalMoney)}
                        </span>
                      </div>
                    </div>
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Success;

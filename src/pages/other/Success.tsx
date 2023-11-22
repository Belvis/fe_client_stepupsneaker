import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import { Button, Result } from "antd";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { Link, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { getDiscountPrice } from "../../helpers/product";
import {
  HomeFilled,
  CarFilled,
  CreditCardFilled,
  CaretLeftOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { HttpError, useOne } from "@refinedev/core";

const Success = () => {
  const { t } = useTranslation();

  useDocumentTitle(t("nav.pages.my_account") + " | SUNS");

  let { pathname } = useLocation();
  let { id } = useParams();

  const { data, isLoading, isError } = useOne<any, HttpError>({
    resource: "orders",
    id: id,
  });

  const order = data?.data ? data?.data : {};

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Something went wrong!</div>;
  }

  console.log(order);

  const { cartItems } = useSelector((state: RootState) => state.cart);
  const currency = useSelector((state: RootState) => state.currency);
  const dispatch = useDispatch();

  let cartTotalPrice = 0;

  return (
    <Fragment>
      <Breadcrumb
        pages={[
          { label: "home", path: "/" },
          { label: "pages.my_account", path: pathname },
        ]}
      />

      <div
        className="success-area pb-80 pt-100 bg-white"
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
                <Link to={"/shop"}>Mã đơn hàng: 2017182818828182881</Link>
              </div>
              <p>Ngày mua hàng: 22/11/2023</p>
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
                <div className="table-content table-responsive cart-table-content">
                  <table>
                    <thead>
                      <tr>
                        <th style={{ textAlign: "start" }}>
                          <HomeFilled /> Địa chỉ giao hàng
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="product-name">
                          <p>Street: 1676 Dai lo Hung Vuong, Viet Tri</p>
                          <p>City: Viet Tri</p>
                          <p>State/province/area: Vinh Phuc</p>
                          <p>Phone number: 0210. 381 6131</p>
                          <p>Country calling code: +94</p>
                          <p>Country: Vietnam</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 mb-4">
                <div className="table-content table-responsive cart-table-content">
                  <table>
                    <thead>
                      <tr>
                        <th style={{ textAlign: "start" }}>
                          <HomeFilled /> Địa chỉ hóa đơn
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="product-name">
                          <p>Street: 1676 Dai lo Hung Vuong, Viet Tri</p>
                          <p>City: Viet Tri</p>
                          <p>State/province/area: Vinh Phuc</p>
                          <p>Phone number: 0210. 381 6131</p>
                          <p>Country calling code: +94</p>
                          <p>Country: Vietnam</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <div className="table-content table-responsive cart-table-content">
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
                        <td className="product-name">Giao hàng tiết kiệm</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="col-lg-6 col-md-6">
                <div className="table-content table-responsive cart-table-content">
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
                        <td className="product-name">Tiền mặt (Ship COD)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 order-summary table-content table-responsive cart-table-content ">
            <table className="w-100">
              <thead>
                <tr>
                  <th>{t(`cart.table.head.product_name`)}</th>
                  <th style={{ textAlign: "end" }}>
                    {t(`cart.table.head.subtotal`)}
                  </th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((cartItem, key) => {
                  const discountedPrice = getDiscountPrice(
                    cartItem.selectedProductSize?.price ?? 0,
                    0
                  );
                  const finalProductPrice = (
                    (cartItem.selectedProductSize?.price ?? 0) *
                    currency.currencyRate
                  ).toFixed(2);
                  const finalDiscountedPrice =
                    discountedPrice !== null
                      ? parseFloat(
                          (discountedPrice * currency.currencyRate).toFixed(2)
                        )
                      : 0.0;

                  discountedPrice !== null
                    ? (cartTotalPrice +=
                        finalDiscountedPrice * cartItem.quantity)
                    : (cartTotalPrice +=
                        parseFloat(finalProductPrice) * cartItem.quantity);

                  return (
                    <tr key={key}>
                      <td className="product-name">
                        {cartItem.selectedProductColor &&
                        cartItem.selectedProductSize ? (
                          <div className="row">
                            <div className="product-thumbnail col-3">
                              <Link to={"/product/" + cartItem.id}>
                                <img
                                  className="img-fluid"
                                  src={cartItem.image}
                                  alt=""
                                />
                              </Link>
                            </div>
                            <div className="cart-item-variation col-9">
                              <span>
                                {t(`cart.table.head.product_name`)}:{" "}
                                <Link to={"/product/" + cartItem.id}>
                                  {cartItem.name}
                                </Link>
                              </span>
                              <span>
                                {t(`cart.table.head.color`)}:{" "}
                                {cartItem.selectedProductColor.name}
                              </span>
                              <span>
                                {t(`cart.table.head.size`)}:{" "}
                                {cartItem.selectedProductSize.name}
                              </span>
                              <span>
                                {t(`cart.table.head.qty`)}: {cartItem.quantity}
                              </span>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </td>
                      <td className="product-subtotal">
                        {discountedPrice !== null ? (
                          <span className="amount">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: currency.currencyName,
                              currencyDisplay: "symbol",
                            }).format(
                              Number(finalDiscountedPrice) * cartItem.quantity
                            )}
                          </span>
                        ) : (
                          <span className="amount">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: currency.currencyName,
                              currencyDisplay: "symbol",
                            }).format(
                              Number(finalProductPrice) * cartItem.quantity
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
                      <div className="col-10">
                        <h5>{t(`cart.cart_total.total`)} </h5>
                      </div>
                      <div className="col-2">
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
                      <div className="col-10">
                        <h5>{t(`cart.cart_total.shipping`)} </h5>
                      </div>
                      <div className="col-2">
                        <span>
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: currency.currencyName,
                            currencyDisplay: "symbol",
                          }).format(0)}
                        </span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-10">
                        <h4 className="grand-totall-title">
                          {t(`cart.cart_total.grand_total`)}{" "}
                        </h4>
                      </div>
                      <div className="col-2">
                        <span>
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: currency.currencyName,
                            currencyDisplay: "symbol",
                          }).format(Number(cartTotalPrice.toFixed(2)))}
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

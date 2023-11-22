import { useDocumentTitle } from "@refinedev/react-router-v6";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { RootState } from "../../redux/store";
import { Fragment } from "react";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import {
  LoadingOutlined,
  DropboxOutlined,
  CarryOutOutlined,
  CarOutlined,
  FileProtectOutlined,
} from "@ant-design/icons";
import { Steps } from "antd";
import { StepsProps } from "antd/lib";
import { getDiscountPrice } from "../../helpers/product";

const OrderTracking = () => {
  const { t } = useTranslation();

  useDocumentTitle(t("nav.pages.my_account") + " | SUNS");

  let { pathname } = useLocation();

  const { cartItems } = useSelector((state: RootState) => state.cart);
  const currency = useSelector((state: RootState) => state.currency);

  let cartTotalPrice = 0;

  const items: StepsProps["items"] = [
    {
      title: "Đặt hàng",
      status: "finish",
      icon: <DropboxOutlined />,
      subTitle: "20/10/2023",
      description: "Khách đặt hàng online.",
    },
    {
      title: "Chờ xác nhận",
      status: "process",
      icon: <LoadingOutlined />,
    },
    {
      title: "Sẵn sàng",
      status: "wait",
      icon: <CarryOutOutlined />,
    },
    {
      title: "Đang giao",
      status: "wait",
      icon: <CarOutlined />,
    },
    {
      title: "Hoàn tất",
      status: "wait",
      icon: <FileProtectOutlined />,
    },
  ];
  return (
    <Fragment>
      <Breadcrumb
        pages={[
          { label: "home", path: "/" },
          { label: "pages.my_account", path: pathname },
        ]}
      />
      <div className="bg-white p-100">
        <h3>Trạng thái đơn hàng: #000000</h3>
        <hr />
        <div className="table-content table-responsive order-tracking-table-content">
          <table className="w-100">
            <tbody>
              <tr>
                <td className="field">
                  <p>Số điện thoại khách hàng</p>
                </td>
                <td className="value">
                  <p>092857889</p>
                </td>
              </tr>
              <tr>
                <td className="field">
                  <p>Ngày đặt hàng</p>
                </td>
                <td className="value">
                  <p>20/10</p>
                </td>
              </tr>
              <tr>
                <td className="field">
                  <p>Ngày dự kiến giao hàng</p>
                </td>
                <td className="value">
                  <p>30/10</p>
                </td>
              </tr>
              <tr>
                <td className="field">
                  <p>Địa chỉ giao hàng</p>
                </td>
                <td className="value">
                  <p>123 Hoàng Bà Hà Nội</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <hr />
        <Steps items={items} type="navigation" />
        <h3 className="cart-page-title mt-3">Đơn đặt hàng</h3>
        <div className="order-summary table-content table-responsive cart-table-content ">
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
                  ? (cartTotalPrice += finalDiscountedPrice * cartItem.quantity)
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
    </Fragment>
  );
};

export default OrderTracking;

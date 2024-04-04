import { useTranslate } from "@refinedev/core";
import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { FREE_SHIPPING_THRESHOLD } from "../../constants";
import { CurrencyFormatter } from "../../helpers/currency";
import { IOrderResponse } from "../../interfaces";
import { CurrencyState } from "../../redux/slices/currency-slice";

interface OrderDeliverablesProps {
  order: IOrderResponse;
  currency: CurrencyState;
}

const OrderDeliverables: React.FC<OrderDeliverablesProps> = ({ order, currency }) => {
  const t = useTranslate();

  return (
    <Fragment>
      <h3 className="cart-page-title mt-3">{t("order_tracking.deliverables")}</h3>
      <div className="order-summary table-content table-responsive order-tracking-table-content ">
        <table className="w-100">
          <thead>
            <tr>
              <th style={{ textAlign: "start" }}>{t("my_order.fields.product")}</th>
              <th style={{ textAlign: "end" }}>{t(`cart.table.head.subtotal`)}</th>
            </tr>
          </thead>
          <tbody>
            {order.orderDetails.length > 0 &&
              order.orderDetails.map((detail, key) => {
                return (
                  <tr key={key}>
                    <td className="product">
                      <div className="row">
                        <div className="product-thumbnail col-3">
                          <Link to={"/product/" + detail.productDetail.product.id}>
                            <img className="img-fluid" src={detail.productDetail.image} alt="" />
                          </Link>
                        </div>
                        <div className="cart-item-variation col-9">
                          <span>
                            {t(`cart.table.head.product_name`)}:{" "}
                            <Link to={"/product/" + detail.productDetail.product.id}>
                              {detail.productDetail.product.name}
                            </Link>
                          </span>
                          <span>
                            {t(`cart.table.head.color`)}: {detail.productDetail.color.name}
                          </span>
                          <span>
                            {t(`cart.table.head.size`)}: {detail.productDetail.size.name}
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
                        value={detail.totalPrice * currency.currencyRate}
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
                      value={order.originMoney * currency.currencyRate}
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
                        value={order.shippingMoney * currency.currencyRate}
                        currency={currency}
                      />
                    ) : (
                      <span className="free-shipping">{t("common.free_shipping")}</span>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-9">
                    <h5>{t("cart.voucher.voucher")}</h5>
                  </div>
                  <div className="col-3">
                    <CurrencyFormatter
                      className="amount"
                      value={order.reduceMoney * currency.currencyRate}
                      currency={currency}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-9">
                    <h4 className="grand-total-title">{t(`cart.cart_total.grand_total`)} </h4>
                  </div>
                  <div className="col-3">
                    <CurrencyFormatter
                      className="amount"
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
    </Fragment>
  );
};

export default OrderDeliverables;

import { useTranslate } from "@refinedev/core";
import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { CurrencyFormatter } from "../../helpers/currency";
import { IReturnFormResponse } from "../../interfaces";
import { CurrencyState } from "../../redux/slices/currency-slice";

interface ReturnDeliverablesProps {
  returnForm: IReturnFormResponse;
  currency: CurrencyState;
}

const ReturnDeliverables: React.FC<ReturnDeliverablesProps> = ({
  returnForm,
  currency,
}) => {
  const t = useTranslate();

  return (
    <Fragment>
      <h3 className="cart-page-title mt-3">
        {t("return_tracking.deliverables")}
      </h3>
      <div className="order-summary table-content table-responsive order-tracking-table-content ">
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
            {returnForm.returnFormDetails.length > 0 &&
              returnForm.returnFormDetails.map((detail, key) => {
                return (
                  <tr key={key}>
                    <td className="product">
                      <div className="row">
                        <div className="product-thumbnail col-3">
                          <Link
                            to={
                              "/product/" +
                              detail.orderDetail.productDetail.product.id
                            }
                          >
                            <img
                              className="img-fluid"
                              src={detail.orderDetail.productDetail.image}
                              alt=""
                            />
                          </Link>
                        </div>
                        <div className="cart-item-variation col-9">
                          <span>
                            {t(`cart.table.head.product_name`)}:{" "}
                            <Link to={"/product/" + detail.id}>
                              {detail.orderDetail.productDetail.product.name}
                            </Link>
                          </span>
                          <span>
                            {t(`cart.table.head.color`)}:{" "}
                            {detail.orderDetail.productDetail.color.name}
                          </span>
                          <span>
                            {t(`cart.table.head.size`)}:{" "}
                            {detail.orderDetail.productDetail.size.name}
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
                        value={detail.orderDetail.totalPrice}
                        currency={currency}
                      />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </Fragment>
  );
};

export default ReturnDeliverables;

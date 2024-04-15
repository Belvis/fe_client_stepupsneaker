import { useTranslate } from "@refinedev/core";
import { IOrderResponse } from "../interfaces";
import dayjs from "dayjs";
import {
  APP_TITLE,
  CONTACT_EMAIL,
  CONTACT_PHONE_NUMBER,
  STORE_ADDRESS,
} from "../constants";
import { NumberField } from "@refinedev/antd";
import React from "react";
import { QRCode } from "antd";
import "./style.css";

interface InvoiceTemplateProps {
  order: IOrderResponse;
}

export const InvoiceTemplate = React.forwardRef<
  HTMLDivElement,
  InvoiceTemplateProps
>(({ order }, ref) => {
  const t = useTranslate();

  const formattedDate = dayjs(order.createdAt).format("LLLL");
  const defaultAddress = order.customer?.addressList?.find(
    (address) => address.isDefault
  );

  return (
    <div className="d-flex flex-column" ref={ref}>
      <img
        src="/images/sunsneaker_logo.png"
        alt="logoooo"
        className="background-image"
      />
      <div className="mb-4 p-4 ">
        <QRCode
          size={100}
          bordered={false}
          value={order.code || "-"}
          style={{
            position: "absolute",
          }}
        />
        <div className="invoice-header justify-content-center text-center d-flex pb-4 mb-8">
          <div>
            <h2 className="font-weight-bold">{APP_TITLE}</h2>
            <p className="text-muted fs-6">
              {t("customers.fields.phoneNumber")}: {CONTACT_PHONE_NUMBER}
            </p>
            <p className="text-muted fs-6">
              {t("customers.fields.email")}: {CONTACT_EMAIL}
            </p>
            <p className="text-muted fs-6">
              {t("customers.fields.address")}:{" "}
              {`${STORE_ADDRESS.line}, ${STORE_ADDRESS.city}, ${STORE_ADDRESS.province}, ${STORE_ADDRESS.district}`}
            </p>
          </div>
        </div>

        <div className="justify-content-center text-center d-flex pb-4 mb-8">
          <h1 className="h2 font-weight-bold">{t("invoices.title")}</h1>
        </div>

        <div className="row">
          <div className="col-6">
            {order.customer ? (
              <>
                <p className="m-0">
                  <strong>
                    {t("invoices.recipient")}:{" "}
                    {order.customer.fullName ?? t("invoices.retailCustomer")}
                  </strong>
                </p>
                {defaultAddress ? (
                  <div>
                    <p className="m-0">
                      {t("orders.fields.address")}:{" "}
                      {`${defaultAddress.phoneNumber}, ${defaultAddress.more}, ${defaultAddress.provinceName}, ${defaultAddress.districtName}, ${defaultAddress.wardName}`}
                    </p>
                  </div>
                ) : (
                  <p className="m-0">
                    {t("orders.fields.address")}: {t("invoices.noAddress")}
                  </p>
                )}
              </>
            ) : (
              <p className="m-0">
                {t("invoices.recipient")}: {t("invoices.retailCustomer")}
              </p>
            )}
            <p className="m-0">
              {t("employees.employees")}: {order.employee.fullName ?? "N/A"}
            </p>
          </div>
          <div className="col-6 text-end">
            <p className="m-0">
              <strong>
                {t("return-form-details.fields.orderCode")}:{" "}
                {"#" + order.code ?? "N/A"}
              </strong>
            </p>
            <p className="m-0">{formattedDate}</p>
            <p className="m-0">
              {t("colors.fields.status")}:{" "}
              {t(`enum.orderStatuses.${order.status}`)}
            </p>
          </div>
        </div>

        <div className="justify-content-center text-center d-flex">
          <h3 className="font-weight-bold">{t("products.products")}</h3>
        </div>

        <div>
          <table className="table table-transparent my-5">
            <thead>
              <tr className="border-bottom">
                <th className="text-left font-weight-bold py-2">#</th>
                <th className="text-left font-weight-bold py-2">
                  {t("invoices.fields.description")}
                </th>
                <th className="text-left font-weight-bold py-2">
                  {t("invoices.fields.unitPrice")}
                </th>
                <th className="text-left font-weight-bold py-2">
                  {t("invoices.fields.quantity")}
                </th>
                <th className="text-left font-weight-bold py-2">
                  {t("invoices.fields.totalPrice")}
                </th>
              </tr>
            </thead>
            <tbody>
              {order.orderDetails &&
                order.orderDetails.map((item, index) => (
                  <tr className="border-b border-gray-300">
                    <td className="py-2">{index + 1}</td>
                    <td className="py-2">
                      {item.productDetail.product.name} |{" "}
                      {item.productDetail.color.name} -{" "}
                      {item.productDetail.size.name}
                    </td>
                    <td className="py-2">
                      <NumberField
                        options={{
                          currency: "VND",
                          style: "currency",
                        }}
                        value={item.price}
                        locale={"vi"}
                      />
                    </td>
                    <td className="py-2">{item.quantity}</td>
                    <td className="py-2">
                      <NumberField
                        options={{
                          currency: "VND",
                          style: "currency",
                        }}
                        value={item.totalPrice}
                        locale={"vi"}
                      />
                    </td>
                  </tr>
                ))}

              <tr className="border-b border-gray-300">
                <th className="text-left font-bold py-2"></th>
                <th className="text-left font-bold py-2">
                  {t("invoices.fields.total")}
                </th>
                <th className="text-left font-bold py-2"></th>
                <th className="text-left font-bold py-2"></th>
                <th className="text-left font-bold py-2">
                  <NumberField
                    options={{
                      currency: "VND",
                      style: "currency",
                    }}
                    value={order.originMoney}
                    locale={"vi"}
                  />
                </th>
              </tr>
              <tr className="border-b border-gray-300">
                <th className="text-left font-bold py-2"></th>
                <th className="text-left font-bold py-2">
                  {t("invoices.fields.reduceMoney")}
                </th>
                <th className="text-left font-bold py-2"></th>
                <th className="text-left font-bold py-2"></th>
                <th className="text-left font-bold py-2">
                  <NumberField
                    options={{
                      currency: "VND",
                      style: "currency",
                    }}
                    value={order.reduceMoney}
                    locale={"vi"}
                  />
                </th>
              </tr>
              <tr className="border-b border-gray-300">
                <th className="text-left font-bold py-2"></th>
                <th className="text-left font-bold py-2">
                  {t("invoices.fields.totalMoney")}
                </th>
                <th className="text-left font-bold py-2"></th>
                <th className="text-left font-bold py-2"></th>
                <th className="text-left font-bold py-2">
                  <NumberField
                    options={{
                      currency: "VND",
                      style: "currency",
                    }}
                    value={order.totalMoney}
                    locale={"vi"}
                  />
                </th>
              </tr>
            </tbody>
          </table>
          <div className="invoice-footer ">
            <hr className="my-4 " />
            <div className=" d-flex justify-content-between align-items-start ">
              <div>
                <h6 className="text-secondary fw-light">
                  {t("invoices.title")} #{order.code}
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

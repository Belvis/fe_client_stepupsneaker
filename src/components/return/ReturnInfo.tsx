import { useTranslate } from "@refinedev/core";
import { Flex } from "antd";
import dayjs from "dayjs";
import React, { Fragment } from "react";
import { IReturnFormResponse } from "../../interfaces";
import { ReturnRefundStatus } from "./ReturnRefundStatus";

interface ReturnInfoProps {
  returnForm: IReturnFormResponse;
}

const ReturnInfo: React.FC<ReturnInfoProps> = ({ returnForm }) => {
  const t = useTranslate();

  return (
    <Fragment>
      <Flex gap="middle" align="center" justify="space-between">
        <h3>
          {t("return_tracking.title")}: #{returnForm && returnForm.code}
        </h3>
      </Flex>
      <hr />
      <div className="table-content table-responsive order-tracking-table-content">
        <table className="w-100">
          <tbody>
            <tr>
              <td className="field">
                <p>{t("return_tracking.fields.phoneNumber")}</p>
              </td>
              <td className="value">
                <p>{returnForm.phoneNumber}</p>
              </td>
            </tr>
            <tr>
              <td className="field">
                <p>{t("return_tracking.fields.email")}</p>
              </td>
              <td className="value">
                <p>{returnForm.email}</p>
              </td>
            </tr>
            <tr>
              <td className="field">
                <p>{t("return_tracking.fields.date")}</p>
              </td>
              <td className="value">
                <p>{dayjs(new Date(returnForm.createdAt)).format("LLL")}</p>
              </td>
            </tr>
            <tr>
              <td className="field">
                <p>{t("return_tracking.fields.amountToBePaid")}</p>
              </td>
              <td className="value">
                <p>{returnForm.amountToBePaid}</p>
              </td>
            </tr>
            <tr>
              <td className="field">
                <p>{t("return_tracking.fields.refundStatus")}</p>
              </td>
              <td className="value">
                <ReturnRefundStatus status={returnForm.refundStatus} />
              </td>
            </tr>
            <tr>
              <td className="field">
                <p>{t("return_tracking.fields.address")}</p>
              </td>
              <td className="value">
                <p>
                  {returnForm.address &&
                    `${returnForm.address.more}, ${returnForm.address.wardName}, ${returnForm.address.districtName}, ${returnForm.address.provinceName}`}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <hr />
    </Fragment>
  );
};

export default ReturnInfo;

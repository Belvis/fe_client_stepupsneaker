import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useParams } from "react-router-dom";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { Card, Col, Result, Row, Space, Typography } from "antd";
import dayjs from "dayjs";
import { TbTruckReturn } from "react-icons/tb";
import { motion } from "framer-motion";
import { CHILDREN_VARIANT, PARENT_VARIANT } from "../../constants/motions";
import { HttpError, useOne } from "@refinedev/core";
import { IReturnFormDetailRequest, IReturnFormDetailResponse, IReturnFormResponse } from "../../interfaces";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import { CurrencyFormatter } from "../../helpers/currency";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ReturnRefundStatus } from "../../components/return/ReturnRefundStatus";
import { ReturnDeliveryStatus } from "../../components/return/ReturnDeliveryStatus";

const { Text } = Typography;

const Success = () => {
  const { t } = useTranslation();
  let { pathname } = useLocation();
  let { code } = useParams();
  const currency = useSelector((state: RootState) => state.currency);

  console.log(code);

  const setTitle = useDocumentTitle();

  useEffect(() => {
    setTitle(t("nav.pages.success") + " | SUNS");
  }, [t]);

  const { data, isLoading, isError } = useOne<IReturnFormResponse, HttpError>({
    resource: "return-forms/tracking",
    id: code,
  });

  const [returnDetails, setReturnDetails] = useState<IReturnFormDetailRequest[]>();

  const returnForm = data?.data;

  useEffect(() => {
    if (returnForm) {
      const returnFormDetailsResponse: IReturnFormDetailResponse[] = returnForm.returnFormDetails;

      const returnFormDetailsRequest = returnFormDetailResponseToRequestList(
        returnFormDetailsResponse,
        returnForm.order.code
      );
      setReturnDetails(returnFormDetailsRequest);
    }
  }, [returnForm]);

  return (
    <Fragment>
      <Breadcrumb
        pages={[
          { label: "home", path: "/" },
          { label: "pages.checkout", path: "/checkout" },
          { label: "pages.success", path: pathname },
        ]}
      />

      {returnForm ? (
        <div className="success-area pb-80 bg-white" style={{ padding: "80px 30px 100px 30px" }}>
          <Space direction="vertical" className="w-100" size="middle">
            <Card>
              <Result
                status="success"
                title={t("return_success.title")}
                icon={<TbTruckReturn size={120} color="#52c41a" />}
                subTitle={
                  <div>
                    <Text className="h4">{t("return_success.subtitle")}</Text>
                    <br />
                    <Text className="h4" strong>
                      {returnForm.phoneNumber}
                    </Text>
                  </div>
                }
              />
            </Card>
            <Card
              styles={{
                header: {
                  paddingRight: "69px",
                  paddingLeft: "69px",
                },
              }}
              title={`${t("return-forms.fields.code")}: ${returnForm.code}`}
            >
              <Row
                gutter={[16, 24]}
                style={{
                  paddingRight: "45px",
                  paddingLeft: "45px",
                }}
              >
                <Col span={6}>
                  <Space direction="vertical" className="w-100">
                    <Text>Ngày gửi:</Text>
                    <Text>{dayjs(new Date(returnForm.createdAt)).format("LLL")}</Text>
                  </Space>
                </Col>
                <Col span={6}>
                  <Space direction="vertical">
                    <Text>Tổng số tiền được hoàn:</Text>
                    {returnForm.amountToBePaid == 0 ? (
                      <ReturnRefundStatus status={returnForm.refundStatus} />
                    ) : (
                      <CurrencyFormatter
                        value={returnForm.amountToBePaid * currency.currencyRate}
                        currency={currency}
                      />
                    )}
                  </Space>
                </Col>
                <Col span={6}>
                  <Space direction="vertical">
                    <Text>Trạng giao hàng hoàn trả:</Text>
                    <ReturnDeliveryStatus status={returnForm.returnDeliveryStatus} />
                  </Space>
                </Col>
                <Col span={6}>
                  <Space direction="vertical">
                    <Text>Trạng thái hoàn trả:</Text>
                    <ReturnRefundStatus status={returnForm.refundStatus} />
                  </Space>
                </Col>
              </Row>

              {returnDetails && returnDetails.length > 0 && (
                <div className="table-content table-responsive cart-table-content mt-5">
                  <motion.table
                    layout
                    style={{
                      overflow: "hidden",
                      width: "100%",
                    }}
                  >
                    <motion.thead layout>
                      <motion.tr>
                        <th>{t(`cart.table.head.image`)}</th>
                        <th>{t("return-form-details.fields.product")}</th>
                        <th>{t("return-form-details.fields.quantity")}</th>
                        <th>{t("return-form-details.fields.reason.label")}</th>
                        <th>{t("return-form-details.fields.feedback.label")}</th>
                      </motion.tr>
                    </motion.thead>
                    <motion.tbody layout variants={PARENT_VARIANT} initial="hidden" animate="show">
                      {returnDetails.map((returnDetail, key) => {
                        return (
                          <motion.tr key={key} layout variants={CHILDREN_VARIANT}>
                            <td className="product-thumbnail">
                              <Link to={"/product/" + returnDetail.orderDetail.productDetail.product.id}>
                                <img
                                  className="img-fluid"
                                  src={returnDetail.orderDetail.productDetail.product.image}
                                  alt=""
                                />
                              </Link>
                            </td>
                            <td className="product-name text-center">{returnDetail.name}</td>

                            <td className="product-quantity text-center">{returnDetail.returnQuantity}</td>
                            <td className="product-quantity text-center">
                              <div className="cart-plus-minus w-100 pe-2">
                                <p>{returnDetail.reason}</p>
                              </div>
                            </td>
                            <td className="product-quantity text-center">
                              <div className="cart-plus-minus w-100 pe-2">
                                <p>{returnDetail.feedback}</p>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </motion.tbody>
                  </motion.table>
                </div>
              )}
              <div className="row">
                <div className="col-lg-12">
                  <div className="cart-shiping-update-wrapper">
                    <div className="cart-shiping-update">
                      <Link to={"/shop"}>{t(`cart.buttons.continue_shopping`)}</Link>
                    </div>
                    <div className="cart-clear">
                      <Link to={`/return-tracking/${returnForm.code}`}>{t("return_success.buttons.tracking")}</Link>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Space>
        </div>
      ) : null}
    </Fragment>
  );
};

export default Success;

export const returnFormDetailResponseToRequestList = (
  responseList: IReturnFormDetailResponse[],
  orderCode: string
): IReturnFormDetailRequest[] => {
  return responseList.map((responseItem) => returnFormDetailResponseToRequest(responseItem, orderCode));
};

export const returnFormDetailResponseToRequest = (
  responseDetail: IReturnFormDetailResponse,
  orderCode: string
): IReturnFormDetailRequest => {
  return {
    id: responseDetail.id,
    orderCode: orderCode,
    orderDetail: responseDetail.orderDetail,
    quantity: responseDetail.orderDetail.quantity,
    returnQuantity: responseDetail.quantity,
    name: `${responseDetail.orderDetail.productDetail.product.name} | ${responseDetail.orderDetail.productDetail.color.name} -  ${responseDetail.orderDetail.productDetail.size.name}`,
    unitPrice: responseDetail.orderDetail.price,
    reason: responseDetail.reason,
    feedback: responseDetail.feedback,
    selected: false,
  };
};

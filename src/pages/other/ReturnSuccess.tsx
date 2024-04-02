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
import {
  IReturnFormDetailRequest,
  IReturnFormDetailResponse,
  IReturnFormResponse,
} from "../../interfaces";
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
  let { id } = useParams();
  const currency = useSelector((state: RootState) => state.currency);

  const setTitle = useDocumentTitle();

  useEffect(() => {
    setTitle(t("nav.pages.success") + " | SUNS");
  }, [t]);

  const { data, isLoading, isError } = useOne<IReturnFormResponse, HttpError>({
    resource: "return-forms",
    id: id,
  });

  const [returnDetails, setReturnDetails] =
    useState<IReturnFormDetailRequest[]>();

  const returnForm = data?.data;

  useEffect(() => {
    if (returnForm) {
      const returnFormDetailsResponse: IReturnFormDetailResponse[] =
        returnForm.returnDetails;

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
        <div
          className="success-area pb-80 bg-white"
          style={{ padding: "80px 30px 100px 30px" }}
        >
          <Space direction="vertical" className="w-100" size="middle">
            <Card>
              <Result
                status="success"
                title="Phiếu trả hàng của bạn đã được gửi!"
                icon={<TbTruckReturn size={120} color="#52c41a" />}
                subTitle={
                  <div>
                    <Text className="h4">
                      Chúng tôi sẽ gọi điện xác nhận cho bạn qua số điện thoại
                      dưới đây
                    </Text>
                    <br />
                    <Text className="h4" strong>
                      Đơn khách lẻ thì lấy số điện thoại ở đâu hả nguyên!!!
                    </Text>
                  </div>
                }
              />
            </Card>
            <Card
              headStyle={{
                paddingRight: "69px",
                paddingLeft: "69px",
              }}
              title={`Mã phiếu trả hàng: ${returnForm.code}`}
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
                    <Text>
                      {dayjs(new Date(returnForm.createdAt)).format("LLL")}
                    </Text>
                  </Space>
                </Col>
                <Col span={6}>
                  <Space direction="vertical">
                    <Text>Tổng số tiền được hoàn:</Text>
                    <CurrencyFormatter
                      value={returnForm.amountToBePaid}
                      currency={currency}
                    />
                  </Space>
                </Col>
                <Col span={6}>
                  <Space direction="vertical">
                    <Text>Trạng giao hàng hoàn trả:</Text>
                    <ReturnDeliveryStatus
                      status={returnForm.returnDeliveryStatus}
                    />
                  </Space>
                </Col>
                <Col span={6}>
                  <Space direction="vertical">
                    <Text>Trạng thái hoàn trả:</Text>
                    <ReturnRefundStatus status={returnForm.refundStatus} />
                  </Space>
                </Col>
              </Row>

              {returnDetails && (
                <div className="table-content table-responsive cart-table-content">
                  <motion.table
                    layout
                    style={{
                      overflow: "hidden",
                      width: "100%",
                    }}
                  >
                    <motion.thead layout>
                      <motion.tr>
                        <th className="text-start">
                          {t(`cart.table.head.image`)}
                        </th>
                        <th className="text-start">Sản phẩm</th>
                        <th className="text-start">SL hoàn trả</th>
                        <th className="text-start">Lý do</th>
                        <th className="text-start">Feedback</th>
                      </motion.tr>
                    </motion.thead>
                    <motion.tbody
                      layout
                      variants={PARENT_VARIANT}
                      initial="hidden"
                      animate="show"
                    >
                      {returnDetails.map((returnDetail, key) => {
                        return (
                          <motion.tr
                            key={key}
                            layout
                            variants={CHILDREN_VARIANT}
                          >
                            <td className="product-thumbnail">
                              <Link
                                to={
                                  "/product/" +
                                  returnDetail.orderDetail.productDetail.product
                                    .id
                                }
                              >
                                <img
                                  className="img-fluid"
                                  src={
                                    returnDetail.orderDetail.productDetail
                                      .product.image
                                  }
                                  alt=""
                                />
                              </Link>
                            </td>
                            <td className="product-name text-center">
                              {returnDetail.name}
                              <br />
                            </td>

                            <td className="product-quantity">
                              {returnDetail.returnQuantity}
                            </td>
                            <td className="product-quantity">
                              <div className="cart-plus-minus w-100 pe-2">
                                <textarea
                                  id="reason-field"
                                  className="cart-plus-minus-box w-100"
                                  value={returnDetail.reason}
                                />
                              </div>
                            </td>
                            <td className="product-quantity">
                              <div className="cart-plus-minus w-100 pe-2">
                                <textarea
                                  id="feedback-field"
                                  className="cart-plus-minus-box w-100"
                                  value={returnDetail.feedback}
                                />
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </motion.tbody>
                  </motion.table>
                </div>
              )}
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
  return responseList.map((responseItem) =>
    returnFormDetailResponseToRequest(responseItem, orderCode)
  );
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

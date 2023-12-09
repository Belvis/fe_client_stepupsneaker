import {
  CaretLeftOutlined,
  CloseCircleOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import { Result, Typography } from "antd";
import React, { Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";

const { Paragraph, Text } = Typography;

const SubmissionFailed: React.FC = ({}) => {
  const { t } = useTranslation();

  const setTitle = useDocumentTitle();

  useEffect(() => {
    setTitle(t("nav.pages.submission_failed") + " | SUNS");
  }, [t]);

  let { pathname } = useLocation();

  return (
    <Fragment>
      <Breadcrumb
        pages={[
          { label: "home", path: "/" },
          { label: "pages.submission_failed", path: pathname },
        ]}
      />
      <div className="pt-95 pb-100 bg-white">
        <Result
          status="error"
          title="Đặt hàng thất bại"
          subTitle={
            <div>
              <p>Quý khách vui lòng kiểm tra thông tin sau</p>
              {/* <div className="order-code">
                <Link to={"/orders/tracking/" + order.id}>
                  Mã đơn hàng: {order.code.toUpperCase()}
                </Link>
              </div>
              <p>
                Ngày mua hàng:{" "}
                {dayjs(new Date(order.createdAt ?? 0)).format("DD/MM/YYYY")}
              </p> */}
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
        >
          <div className="desc">
            <Paragraph>
              <Text
                strong
                style={{
                  fontSize: 16,
                }}
              >
                The content you submitted has the following error:
              </Text>
            </Paragraph>
            <Paragraph>
              <CloseCircleOutlined className="site-result-demo-error-icon" />{" "}
              Your account has been frozen. <a>Thaw immediately &gt;</a>
            </Paragraph>
            <Paragraph>
              <CloseCircleOutlined className="site-result-demo-error-icon" />{" "}
              Your account is not yet eligible to apply.{" "}
              <a>Apply Unlock &gt;</a>
            </Paragraph>
          </div>
        </Result>
      </div>
    </Fragment>
  );
};

export default SubmissionFailed;

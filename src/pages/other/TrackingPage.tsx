import { Fragment, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import { useApiUrl } from "@refinedev/core";
import { dataProvider } from "../../api/dataProvider";
import { Form, notification } from "antd";

const TrackingPage = () => {
  let { pathname } = useLocation();
  const navigate = useNavigate();

  const { t } = useTranslation();

  const setTitle = useDocumentTitle();

  useEffect(() => {
    setTitle(t("nav.pages.tracking_page") + " | SUNS");
  }, [t]);

  const API_URL = useApiUrl();

  const { getOne } = dataProvider(API_URL);

  const trackOrder = async (code: string) => {
    try {
      const res = await getOne({ resource: "orders/tracking", id: code });
      navigate(`/tracking/${code}`);
      notification.success({
        message: "Hoàn tất",
        description: "Tra cứu đơn hàng thành công",
      });
    } catch (error: any) {
      notification.error({
        message: "Không tìm thấy đơn hàng",
        description: "Lỗi: " + error.message,
      });
    }
  };

  const [form] = Form.useForm<{
    code: string;
  }>();

  return (
    <Fragment>
      <Breadcrumb
        pages={[
          { label: "home", path: "/" },
          { label: "pages.tracking_page", path: pathname },
        ]}
      />
      <div className="tracking-page-area pt-100 pb-100 bg-white">
        <div className="container">
          <div className="row justify-content-start">
            <div className="col-xl-7 col-lg-8 text-center">
              <div className="">
                <h2>Tra cứu đơn hàng</h2>
                <p>Nhập mã đơn hàng để thực hiện tra cứu</p>
                <Form
                  form={form}
                  name="shipping-address"
                  layout="vertical"
                  onFinish={(values) => trackOrder(values.code)}
                  // onFinishFailed={onFinishFailed}
                  autoComplete="off"
                  className="searchform mb-50"
                >
                  <Form.Item
                    name="code"
                    rules={[
                      {
                        required: true,
                        message: "Mã hoá đơn không được để trống!",
                      },
                    ]}
                  >
                    <input
                      type="text"
                      name="code"
                      id="error_search"
                      placeholder="Nhập mã đơn hàng... Ví dụ: SUS-HGDKA"
                      className="searchform__input"
                    />
                  </Form.Item>
                  <div>
                    <button type="submit" className="searchform__submit">
                      <i className="fa fa-search" />
                    </button>
                  </div>
                </Form>
                <Link to={"/"} className="error-btn">
                  Trở lại trang chủ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default TrackingPage;

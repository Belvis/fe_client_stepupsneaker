import { Fragment, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import { useApiUrl } from "@refinedev/core";
import { dataProvider } from "../../api/dataProvider";
import { Form, notification } from "antd";
import { showErrorToast } from "../../helpers/toast";

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

  const [code, setCode] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!code.trim()) {
      showErrorToast("Vui lòng nhập mã đơn hàng");
      return;
    }

    try {
      await trackOrder(code);
    } catch (error) {
      console.error("Lỗi khi tra cứu đơn hàng:", error);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value);
  };

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
                <form className="searchform mb-50" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="search"
                    id="error_search"
                    placeholder="Nhập mã đơn hàng... Ví dụ: SUS-HGDKA"
                    className="searchform__input"
                    value={code}
                    onChange={handleChange}
                  />
                  <button type="submit" className="searchform__submit">
                    <i className="fa fa-search" />
                  </button>
                </form>
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

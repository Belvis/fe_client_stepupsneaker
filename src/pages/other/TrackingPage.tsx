import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@refinedev/react-router-v6";

const TrackingPage = () => {
  let { pathname } = useLocation();

  const { t } = useTranslation();

  useDocumentTitle(t("nav.pages.tracking_page") + " | SUNS");

  return (
    <Fragment>
      <Breadcrumb
        pages={[
          { label: "home", path: "/" },
          { label: "pages.order", path: "/order" },
          { label: "pages.tracking_page", path: pathname },
        ]}
      />
      <div className="tracking-page-area pt-100 pb-100 bg-white">
        <div className="container">
          <div className="row justify-content-start">
            <div className="col-xl-7 col-lg-8 text-center">
              <div className="">
                <h2>Tra cứu đơn hàng</h2>
                <p>Nhập mã đơn hàng và số điện thoại để thực hiện tra cứu</p>
                <form className="searchform mb-50">
                  <input
                    type="text"
                    name="search"
                    id="error_search"
                    placeholder="Nhập mã đơn hàng và số điện thoại... Ví dụ: #SUS-HGDKA 092527582"
                    className="searchform__input"
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

import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@refinedev/react-router-v6";

const NotFound = () => {
  let { pathname } = useLocation();

  const { t } = useTranslation();

  useDocumentTitle(t("nav.pages.404_page") + " | SUNS");

  return (
    <Fragment>
      <Breadcrumb
        pages={[
          { label: "home", path: "/" },
          { label: "pages.404_page", path: pathname },
        ]}
      />
      <div className="error-area pt-40 pb-100 bg-white">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-7 col-lg-8 text-center">
              <div className="error">
                <h1>404</h1>
                <h2>BUỒN BAYY! TRANG KHÔNG TÌM THẤY</h2>
                <p>
                  Rất tiếc, nhưng trang bạn đang tìm kiếm không tồn tại, đã bị
                  xóa, đổi tên hoặc tạm thời không khả dụng.
                </p>
                <form className="searchform mb-50">
                  <input
                    type="text"
                    name="search"
                    id="error_search"
                    placeholder="Tìm kiếm..."
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

export default NotFound;

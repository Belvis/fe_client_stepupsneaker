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
      <div className="error-area pt-40 pb-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-7 col-lg-8 text-center">
              <div className="error">
                <h1>404</h1>
                <h2>OPPS! PAGE NOT FOUND</h2>
                <p>
                  Sorry but the page you are looking for does not exist, have
                  been removed, name changed or is temporarity unavailable.
                </p>
                <form className="searchform mb-50">
                  <input
                    type="text"
                    name="search"
                    id="error_search"
                    placeholder="Search..."
                    className="searchform__input"
                  />
                  <button type="submit" className="searchform__submit">
                    <i className="fa fa-search" />
                  </button>
                </form>
                <Link to={"/"} className="error-btn">
                  Back to home page
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

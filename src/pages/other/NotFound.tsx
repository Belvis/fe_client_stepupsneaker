import { Fragment, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import { useTranslate } from "@refinedev/core";

const NotFound = () => {
  let { pathname } = useLocation();

  const t = useTranslate();

  const setTitle = useDocumentTitle();

  useEffect(() => {
    setTitle(t("nav.pages.404_page") + " | SUNS");
  }, [t]);

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
                <h1>{t("not_found.title")}</h1>
                <h2>{t("not_found.subtitle")}</h2>
                <p>{t("not_found.description")}</p>
                <form className="searchform mb-50">
                  <input
                    type="text"
                    name="search"
                    id="error_search"
                    placeholder={t("common.search") + "..."}
                    className="searchform__input"
                  />
                  <button type="submit" className="searchform__submit">
                    <i className="fa fa-search" />
                  </button>
                </form>
                <Link to={"/"} className="error-btn">
                  {t("buttons.back_home")}
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

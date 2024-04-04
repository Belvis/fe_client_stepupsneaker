import { useApiUrl, useTranslate } from "@refinedev/core";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import { notification } from "antd";
import { Fragment, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { showErrorToast } from "../../helpers/toast";
import { dataProvider } from "../../providers/dataProvider";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";

const TrackingPage = () => {
  let { pathname } = useLocation();
  const navigate = useNavigate();

  const t = useTranslate();

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
        message: t("tracking_page.message.success"),
        description: t("common.success"),
      });
    } catch (error: any) {
      notification.error({
        message: t("common.error") + error.message,
        description: "Oops...",
      });
    }
  };

  const [code, setCode] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!code.trim()) {
      showErrorToast(t("tracking_page.message.required"));
      return;
    }

    try {
      await trackOrder(code);
    } catch (error) {
      console.error(t("common.error"), error);
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
                <h2>{t("tracking_page.title")}</h2>
                <p>{t("tracking_page.subtitle")}</p>
                <form className="searchform mb-50" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="search"
                    id="error_search"
                    placeholder={t("tracking_page.placeholder")}
                    className="searchform__input"
                    value={code}
                    onChange={handleChange}
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

export default TrackingPage;

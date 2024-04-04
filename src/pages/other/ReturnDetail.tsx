import { HttpError, useOne } from "@refinedev/core";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import { Spin } from "antd";
import { Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import ReturnDeliverables from "../../components/return/ReturnDeliverables";
import ReturnInfo from "../../components/return/ReturnInfo";
import { ReturnSteps } from "../../components/return/ReturnSteps";
import { IReturnFormResponse } from "../../interfaces";
import { RootState } from "../../redux/store";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";

const ReturnDetail = () => {
  const { t } = useTranslation();

  const setTitle = useDocumentTitle();

  useEffect(() => {
    setTitle(t("nav.pages.return_tracking") + " | SUNS");
  }, [t]);

  let { pathname } = useLocation();

  let { id } = useParams();

  const { data, isLoading, isError, refetch } = useOne<
    IReturnFormResponse,
    HttpError
  >({
    resource: "return-forms",
    id: id,
  });

  const returnForm = data?.data;

  const currency = useSelector((state: RootState) => state.currency);

  return (
    <Fragment>
      <Breadcrumb
        pages={[
          { label: "home", path: "/" },
          { label: "pages.orders", path: "/pages/my-account/orders" },
          { label: "pages.return_tracking", path: pathname },
        ]}
      />
      <Spin spinning={isLoading}>
        <div className="bg-white p-100">
          {returnForm && (
            <Fragment>
              <ReturnInfo returnForm={returnForm} />
              <ReturnSteps record={returnForm} />
              <ReturnDeliverables returnForm={returnForm} currency={currency} />
            </Fragment>
          )}
        </div>
      </Spin>
    </Fragment>
  );
};

export default ReturnDetail;

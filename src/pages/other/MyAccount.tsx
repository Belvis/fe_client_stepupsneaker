import { useGetIdentity } from "@refinedev/core";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import { Spin } from "antd";
import { Fragment, useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import AccountAddress from "../../components/my-account/AccountAddress";
import AccountChangePassword from "../../components/my-account/AccountChangePassword";
import AccountInfor from "../../components/my-account/AccountInfor";
import AccountVoucher from "../../components/my-account/AccountVoucher";
import { ICustomerResponse } from "../../interfaces";
import { RootState } from "../../redux/store";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";

const MyAccount = () => {
  const { t } = useTranslation();

  const setTitle = useDocumentTitle();

  useEffect(() => {
    setTitle(t("nav.pages.my_account") + " | SUNS");
  }, [t]);

  const currency = useSelector((state: RootState) => state.currency);

  let { pathname } = useLocation();

  const { data, refetch } = useGetIdentity<ICustomerResponse>();

  return (
    <Fragment>
      <Breadcrumb
        pages={[
          { label: "home", path: "/" },
          { label: "pages.my_account", path: pathname },
        ]}
      />
      <div className="myaccount-area pb-80 pt-100 bg-white">
        <Spin tip="Loading" size="small" spinning={!data}>
          <div className="container">
            <div className="row">
              <div className="ms-auto me-auto col-lg-9">
                <div className="myaccount-wrapper">
                  <Accordion defaultActiveKey="0">
                    <AccountInfor data={data} refetch={refetch} />

                    <AccountChangePassword />

                    <AccountAddress data={data} refetch={refetch} />

                    <AccountVoucher data={data} currency={currency} />
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </Spin>
      </div>
    </Fragment>
  );
};

export default MyAccount;

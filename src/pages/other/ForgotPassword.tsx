import {
  LoginFormTypes,
  useForgotPassword,
  useTranslate,
} from "@refinedev/core";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import { Form, FormProps } from "antd";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { validateEmail } from "../../helpers/validate";

type ForgotPasswordProps = {
  formProps?: FormProps<any> | undefined;
};

type forgotPasswordVariables = {
  email: string;
};

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ formProps }) => {
  const t = useTranslate();

  const setTitle = useDocumentTitle();

  useEffect(() => {
    setTitle(t("nav.pages.forgot_password") + " | SUNS");
  }, [t]);

  let { pathname } = useLocation();

  const [form] = Form.useForm<forgotPasswordVariables>();

  const { mutate: forgotPassword } =
    useForgotPassword<forgotPasswordVariables>();

  const onSubmit = (values: forgotPasswordVariables) => {
    forgotPassword(values);
  };

  return (
    <Fragment>
      <Breadcrumb
        pages={[
          { label: "home", path: "/" },
          { label: "pages.forgot_password", path: pathname },
        ]}
      />
      <div className="login-register-area pt-100 pb-100 bg-white">
        <div className="container">
          <div className="row">
            <div className="col-lg-7 col-md-12 ms-auto me-auto">
              <div className="login-register-wrapper">
                <div className="reset-password-title">
                  <h4>{t("auth_page.forgot_password.title")}</h4>
                  <p></p>
                </div>
                <div className="login-form-container">
                  <div className="login-register-form">
                    <Form<forgotPasswordVariables>
                      layout="vertical"
                      form={form}
                      onFinish={(values) => onSubmit(values)}
                      requiredMark={false}
                      {...formProps}
                    >
                      <Form.Item
                        name="email"
                        rules={[
                          {
                            validator: validateEmail,
                          },
                        ]}
                      >
                        <input
                          type="email"
                          placeholder={t(
                            "auth_page.forgot_password.fields.placeholder"
                          )}
                        />
                      </Form.Item>
                      <div className="button-box">
                        <button
                          type="submit"
                          style={{ width: "100%", lineHeight: 2 }}
                        >
                          <span>
                            {t(
                              "auth_page.forgot_password.buttons.receive_construction"
                            )}
                          </span>
                        </button>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ForgotPassword;

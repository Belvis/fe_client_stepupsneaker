import { LoginFormTypes, useForgotPassword } from "@refinedev/core";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import { Form, FormProps } from "antd";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";

type ForgotPasswordProps = {
  formProps?: FormProps<any> | undefined;
};

type forgotPasswordVariables = {
  email: string;
};

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ formProps }) => {
  const { t } = useTranslation();

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
                  <h4>Quên mật khẩu</h4>
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
                            required: true,
                            whitespace: true,
                            message: "Địa chỉ email không được để trống",
                          },
                        ]}
                      >
                        <input
                          type="email"
                          placeholder="Email đăng ký tài khoản..."
                        />
                      </Form.Item>
                      <div className="button-box">
                        <button
                          type="submit"
                          style={{ width: "100%", lineHeight: 2 }}
                        >
                          <span>Nhận email hướng dẫn</span>
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

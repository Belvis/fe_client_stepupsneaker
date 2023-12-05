import { LoginFormTypes } from "@refinedev/core";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import { Form, FormProps } from "antd";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { BlinkIcon } from "../../components/icons/icon-blink";

type ResetPasswordProps = {
  formProps?: FormProps<any> | undefined;
};

const ResetPassword: React.FC<ResetPasswordProps> = ({ formProps }) => {
  const { t } = useTranslation();

  useDocumentTitle(t("nav.pages.reset_password") + " | SUNS");

  let { pathname } = useLocation();

  const [form] = Form.useForm<LoginFormTypes>();

  return (
    <Fragment>
      <Breadcrumb
        pages={[
          { label: "home", path: "/" },
          { label: "pages.reset_password", path: pathname },
        ]}
      />
      <div className="login-register-area reset-password pt-100 pb-100 bg-white">
        <div className="container">
          <div className="row">
            <div className="col-lg-7 col-md-12 ms-auto me-auto">
              <div className="login-register-wrapper">
                <div className="reset-password-title">
                  <h4>Đặt lại mật khẩu</h4>
                  <p></p>
                </div>
                <div className="login-form-container">
                  <div className="login-register-form">
                    <Form<LoginFormTypes>
                      layout="vertical"
                      form={form}
                      // onFinish={(values) => login(values)}
                      requiredMark={false}
                      initialValues={{
                        remember: false,
                      }}
                      {...formProps}
                    >
                      <Form.Item
                        name="newPassword"
                        rules={[
                          {
                            required: true,
                            message: "Mật khẩu mới không được để trống",
                          },
                        ]}
                      >
                        <input
                          type="password"
                          placeholder="Nhập mật khẩu mới..."
                        />
                      </Form.Item>
                      <Form.Item
                        name="confirmPassword"
                        rules={[{ required: true }]}
                      >
                        <input
                          type="password"
                          placeholder="Xác nhận mật khẩu mới..."
                        />
                      </Form.Item>
                      <div className="button-box">
                        <button
                          type="submit"
                          style={{ width: "100%", lineHeight: 2 }}
                        >
                          <span>Xác nhận</span>
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

export default ResetPassword;

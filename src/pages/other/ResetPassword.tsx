import { LoginFormTypes } from "@refinedev/core";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import { Form, FormProps } from "antd";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { authProvider } from "../../api/authProvider";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import clsx from "clsx";

type ResetPasswordProps = {
  formProps?: FormProps<any> | undefined;
};

type resetPasswordVariables = {
  password: string;
  confirm: string;
  token: string;
};

const AUTH_API_URL = import.meta.env.VITE_BACKEND_API_LOCAL_AUTH_URL;

const ResetPassword: React.FC<ResetPasswordProps> = ({ formProps }) => {
  const { t } = useTranslation();

  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const setTitle = useDocumentTitle();

  useEffect(() => {
    setTitle(t("nav.pages.reset_password") + " | SUNS");
  }, [t]);

  let { pathname } = useLocation();

  const [form] = Form.useForm<resetPasswordVariables>();

  const { resetPassword } = authProvider(AUTH_API_URL);

  const onSubmit = (values: resetPasswordVariables) => {
    const submitData = {
      ...values,
      token,
    };
    const response = resetPassword(submitData);
    console.log(response);
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleTogglePassword = (field: string) => {
    if (field === "password") {
      setShowPassword((prevShowPassword) => !prevShowPassword);
    } else if (field === "confirm") {
      setShowConfirmPassword(
        (prevShowConfirmPassword) => !prevShowConfirmPassword
      );
    }
  };

  const getPasswordEyeIconClass = (show: boolean) =>
    clsx("fa", "fa-fw", "field-icon", "toggle-password", "float-icon", {
      "fa-eye": !show,
      "fa-eye-slash": show,
    });

  const PasswordField = (props: any) => (
    <div>
      <input
        {...props}
        type={showPassword ? "text" : "password"}
        placeholder="Nhập mật khẩu mới"
      />
      <span
        className={getPasswordEyeIconClass(showPassword)}
        onClick={() => handleTogglePassword("password")}
      />
    </div>
  );

  const ConfirmField = (props: any) => (
    <div>
      <input
        {...props}
        type={showConfirmPassword ? "text" : "password"}
        placeholder="Xác nhận mật khẩu mới"
      />
      <span
        className={getPasswordEyeIconClass(showConfirmPassword)}
        onClick={() => handleTogglePassword("confirm")}
      />
    </div>
  );

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
                    <Form<resetPasswordVariables>
                      layout="vertical"
                      form={form}
                      onFinish={(values) => onSubmit(values)}
                      requiredMark={false}
                      initialValues={{
                        remember: false,
                      }}
                      {...formProps}
                    >
                      <Form.Item
                        name="password"
                        rules={[
                          {
                            whitespace: true,
                            required: true,
                            message: "Mật khẩu mới không được để trống",
                          },
                        ]}
                      >
                        <PasswordField />
                      </Form.Item>
                      <Form.Item
                        name="confirm"
                        dependencies={["password"]}
                        hasFeedback
                        rules={[
                          {
                            required: true,
                            message: "Please confirm your password!",
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (
                                !value ||
                                getFieldValue("password") === value
                              ) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error("Mật khẩu mới bạn nhập không khớp!")
                              );
                            },
                          }),
                        ]}
                      >
                        <ConfirmField />
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

import { useNotification, useTranslate } from "@refinedev/core";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import { Form, FormProps } from "antd";
import clsx from "clsx";
import { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { validateCommon } from "../../helpers/validate";
import { authProvider } from "../../providers/authProvider";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";

type ResetPasswordProps = {
  formProps?: FormProps<any> | undefined;
};

type resetPasswordVariables = {
  password: string;
  confirm: string;
  token: string;
};

const AUTH_API_URL = `${window.location.protocol}//${
  window.location.hostname
}:${import.meta.env.VITE_BACKEND_API_AUTH_PATH}`;

const ResetPassword: React.FC<ResetPasswordProps> = ({ formProps }) => {
  const t = useTranslate();
  const navigate = useNavigate();
  const { open } = useNotification();

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
    resetPassword(submitData)
      .then((response) => {
        if (response.success) {
          open?.({
            type: "success",
            message: t("reset_password.messages.success.message"),
            description: t("reset_password.messages.success.description"),
          });
          navigate("/login");
        } else {
          open?.({
            type: "error",
            message: t("common.error") + response.error?.message,
            description: "Oops...",
          });
          console.log(response.error);
        }
      })
      .catch((error) => {
        open?.({
          type: "error",
          message: t("common.error") + error?.message,
          description: "Oops...",
        });
        console.error("Error occurred:", error);
      });
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
        placeholder={t("reset_password.password")}
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
        placeholder={t("reset_password.password")}
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
                  <h4>{t("reset_password.title")}</h4>
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
                            validator: (_, value) =>
                              validateCommon(_, value, t, "password"),
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
                            validator: (_, value) =>
                              validateCommon(_, value, t, "confirmPassword"),
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
                                new Error(
                                  t(
                                    "auth_page.login_register.register.messages.not_match"
                                  )
                                )
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
                          <span>{t("buttons.submit")}</span>
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

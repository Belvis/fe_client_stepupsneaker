import { Fragment, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import {
  LoginFormTypes,
  useActiveAuthProvider,
  useLogin,
  useNotification,
  useRegister,
  useTranslate,
} from "@refinedev/core";
import { Form, FormProps } from "antd";
import { ICustomerRequest } from "../../interfaces";
import clsx from "clsx";
import { toTimeStamp } from "../../helpers/date";
import {
  validateCommon,
  validateEmail,
  validateFullName,
} from "../../helpers/validate";

type LoginRegisterProps = {
  type: "login" | "register";
  formProps?: FormProps<any> | undefined;
};

const LoginRegister: React.FC<LoginRegisterProps> = ({ type, formProps }) => {
  const t = useTranslate();

  let { pathname } = useLocation();

  const setTitle = useDocumentTitle();

  useEffect(() => {
    setTitle(t(`nav.pages.${pathname}`) + " | SUNS");
  }, [t]);

  const [loginForm] = Form.useForm<LoginFormTypes>();

  const [registerForm] = Form.useForm<ICustomerRequest>();

  const authProvider = useActiveAuthProvider();
  const { open } = useNotification();

  const { mutate: login, isLoading } = useLogin<LoginFormTypes>({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const { mutate: register } = useRegister<ICustomerRequest>();

  const onSubmitLogin = (values: LoginFormTypes) => {
    login(values, {
      onSuccess: (data) => {
        if (!data.success) {
          return console.log(data.error);
        }

        open?.({
          type: "success",
          message: t("auth_page.login_register.login.messages.success"),
          description: t("auth_page.login_register.login.messages.hi"),
        });
      },
    });
  };
  const onSubmitRegister = (values: ICustomerRequest) => {
    const submitData = {
      fullName: values.fullName,
      email: values.email,
      dateOfBirth: toTimeStamp(values.dateOfBirth as string),
      password: values.password,
      gender: values.gender,
    };

    register(submitData, {
      onSuccess: () => {
        login(submitData);
      },
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
        id={Math.random()}
        type={showPassword ? "text" : "password"}
        placeholder={t(
          "auth_page.login_register.login.fields.password.placeholder"
        )}
      />
      <span
        id={Math.random() + ""}
        className={getPasswordEyeIconClass(showPassword)}
        onClick={() => handleTogglePassword("password")}
      />
    </div>
  );

  const ConfirmField = (props: any) => (
    <div>
      <input
        {...props}
        id={Math.random()}
        type={showConfirmPassword ? "text" : "password"}
        placeholder={t(
          "auth_page.login_register.login.fields.confirm.placeholder"
        )}
      />
      <span
        id={Math.random() + ""}
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
          { label: `pages.${pathname}`, path: pathname },
        ]}
      />
      <div className="login-register-area pt-100 pb-100 bg-white">
        <div className="container">
          <div className="row">
            <div className="col-lg-7 col-md-12 ms-auto me-auto">
              <div className="login-register-wrapper">
                <Tab.Container activeKey={pathname}>
                  <Nav variant="pills" className="login-register-tab-list">
                    <Nav.Item>
                      <NavLink to="/login">
                        <h4>{t("auth_page.login_register.login.title")}</h4>
                      </NavLink>
                    </Nav.Item>
                    <Nav.Item>
                      <NavLink to="/register">
                        <h4>{t("auth_page.login_register.register.title")}</h4>
                      </NavLink>
                    </Nav.Item>
                  </Nav>
                  <Tab.Content>
                    <Tab.Pane eventKey="/login">
                      <div className="login-form-container">
                        <div className="login-register-form">
                          <Form<LoginFormTypes>
                            layout="vertical"
                            form={loginForm}
                            onFinish={(values) => onSubmitLogin(values)}
                            requiredMark={false}
                            initialValues={{
                              remember: false,
                              email: localStorage.getItem(
                                "SUNS_USER_INFO_EMAIL"
                              ),
                              password: localStorage.getItem(
                                "SUNS_USER_INFO_PASS"
                              ),
                            }}
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
                                id="login-email"
                                type="text"
                                placeholder="Email"
                              />
                            </Form.Item>
                            <Form.Item
                              name="password"
                              rules={[{ required: true, whitespace: true }]}
                            >
                              <PasswordField />
                            </Form.Item>
                            <div className="button-box">
                              <div className="login-toggle-btn">
                                <Form.Item name="remember" noStyle>
                                  <input type="checkbox" />
                                </Form.Item>
                                <label className="ml-10">
                                  {t(
                                    "auth_page.login_register.login.labels.save_login"
                                  )}
                                </label>
                                <Link to={"/forgot-password"}>
                                  {t(
                                    "auth_page.login_register.login.labels.forgot_password"
                                  )}
                                </Link>
                              </div>
                              <button type="submit">
                                <span>
                                  {t("auth_page.login_register.login.title")}
                                </span>
                              </button>
                            </div>
                          </Form>
                        </div>
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="/register">
                      <div className="login-form-container">
                        <div className="login-register-form">
                          <Form<ICustomerRequest>
                            layout="vertical"
                            form={registerForm}
                            onFinish={(values) => onSubmitRegister(values)}
                            requiredMark={false}
                            initialValues={{
                              email: "",
                              password: "",
                              dateOfBirth: "",
                              gender: "",
                              fullName: "",
                              confirm: "",
                            }}
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
                              <input placeholder="Email" type="email" />
                            </Form.Item>
                            <Form.Item
                              name="fullName"
                              rules={[
                                {
                                  validator: validateFullName,
                                },
                              ]}
                            >
                              <input type="text" placeholder="Họ tên" />
                            </Form.Item>
                            <Form.Item
                              name="dateOfBirth"
                              rules={[
                                {
                                  validator: (_, value) =>
                                    validateCommon(_, value, t, "dateOfBirth"),
                                },
                              ]}
                            >
                              <input type="date" />
                            </Form.Item>
                            <Form.Item
                              name="gender"
                              rules={[
                                {
                                  validator: (_, value) =>
                                    validateCommon(_, value, t, "gender"),
                                },
                              ]}
                            >
                              <select>
                                <option value="">
                                  --
                                  {t(
                                    "auth_page.login_register.register.fields.gender.label"
                                  )}
                                  --
                                </option>
                                <option value="Male">
                                  {t(
                                    "auth_page.login_register.register.fields.gender.male"
                                  )}
                                </option>
                                <option value="Female">
                                  {t(
                                    "auth_page.login_register.register.fields.gender.female"
                                  )}
                                </option>
                                <option value="Other">
                                  {t(
                                    "auth_page.login_register.register.fields.gender.other"
                                  )}
                                </option>
                              </select>
                            </Form.Item>
                            <Form.Item
                              name="password"
                              rules={[
                                {
                                  whitespace: true,
                                  required: true,
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
                                  message: t(
                                    "auth_page.login_register.register.messages.confirm"
                                  ),
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
                            <div className="button-box text-center">
                              <button type="submit">
                                <span>
                                  {t("auth_page.login_register.register.title")}
                                </span>
                              </button>
                            </div>
                          </Form>
                        </div>
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default LoginRegister;

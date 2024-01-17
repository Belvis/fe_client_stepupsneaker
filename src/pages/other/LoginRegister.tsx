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
} from "@refinedev/core";
import { Form, FormProps } from "antd";
import { ICustomerRequest } from "../../interfaces";
import clsx from "clsx";
import { toTimeStamp } from "../../helpers/date";

type LoginRegisterProps = {
  type: "login" | "register";
  formProps?: FormProps<any> | undefined;
};

const LoginRegister: React.FC<LoginRegisterProps> = ({ type, formProps }) => {
  const { t } = useTranslation();

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
          message: "Đăng nhập thành công",
          description: `Xin chào`,
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
        placeholder="Mật khẩu"
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
        placeholder="Xác nhận mật khẩu"
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
                        <h4>Đăng nhập</h4>
                      </NavLink>
                    </Nav.Item>
                    <Nav.Item>
                      <NavLink to="/register">
                        <h4>Đăng ký</h4>
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
                              email: "",
                              password: "",
                            }}
                            {...formProps}
                          >
                            <Form.Item
                              name="email"
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng nhập vào địa chỉ email",
                                },
                                {
                                  type: "email",
                                  message: (
                                    <span>
                                      Địa chỉ email không hợp lệ. Vui lòng nhập
                                      vào địa chỉ email có định dạng hợp lệ.
                                    </span>
                                  ),
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
                              rules={[{ required: true }]}
                            >
                              <PasswordField />
                            </Form.Item>
                            <div className="button-box">
                              <div className="login-toggle-btn">
                                <input type="checkbox" />
                                <label className="ml-10">
                                  Lưu thông tin đăng nhập
                                </label>
                                <Link to={"/forgot-password"}>
                                  Quên mật khẩu?
                                </Link>
                              </div>
                              <button type="submit">
                                <span>Đăng nhập</span>
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
                                  required: true,
                                  message: "Vui lòng nhập vào địa chỉ email",
                                },
                                {
                                  type: "email",
                                  message: (
                                    <span>
                                      Địa chỉ email không hợp lệ. Vui lòng nhập
                                      vào địa chỉ email có định dạng hợp lệ.
                                    </span>
                                  ),
                                },
                              ]}
                            >
                              <input placeholder="Email" type="email" />
                            </Form.Item>
                            <Form.Item
                              name="fullName"
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng nhập vào họ và tên!",
                                  whitespace: true,
                                },
                              ]}
                            >
                              <input type="text" placeholder="Họ tên" />
                            </Form.Item>
                            <Form.Item
                              name="dateOfBirth"
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng chọn ngày sinh!",
                                },
                              ]}
                            >
                              <input type="date" />
                            </Form.Item>
                            <Form.Item
                              name="gender"
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng chọn giới tính!",
                                },
                              ]}
                            >
                              <select>
                                <option value="">--Chọn giới tính--</option>
                                <option value="Male">Nam</option>
                                <option value="Female">Nữ</option>
                                <option value="Other">Khác</option>
                              </select>
                            </Form.Item>
                            <Form.Item
                              name="password"
                              rules={[{ required: true }]}
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
                                      new Error(
                                        "Mật khẩu mới bạn nhập không khớp!"
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
                                <span>Đăng ký</span>
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

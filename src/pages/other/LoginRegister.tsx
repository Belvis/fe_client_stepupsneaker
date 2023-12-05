import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import {
  LoginFormTypes,
  useActiveAuthProvider,
  useLogin,
} from "@refinedev/core";
import { Form, FormProps } from "antd";

type LoginRegisterProps = {
  type: "login" | "register";
  formProps?: FormProps<any> | undefined;
};

const LoginRegister: React.FC<LoginRegisterProps> = ({ type, formProps }) => {
  const { t } = useTranslation();

  useDocumentTitle(t("nav.pages.login_register") + " | SUNS");

  let { pathname } = useLocation();

  const [form] = Form.useForm<LoginFormTypes>();

  const authProvider = useActiveAuthProvider();
  const { mutate: login, isLoading } = useLogin<LoginFormTypes>({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  return (
    <Fragment>
      <Breadcrumb
        pages={[
          { label: "home", path: "/" },
          { label: "pages.login_register", path: pathname },
        ]}
      />
      <div className="login-register-area pt-100 pb-100 bg-white">
        <div className="container">
          <div className="row">
            <div className="col-lg-7 col-md-12 ms-auto me-auto">
              <div className="login-register-wrapper">
                <Tab.Container defaultActiveKey={type}>
                  <Nav variant="pills" className="login-register-tab-list">
                    <Nav.Item>
                      <Nav.Link eventKey="login">
                        <h4>Đăng nhập</h4>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="register">
                        <h4>Đăng ký</h4>
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                  <Tab.Content>
                    <Tab.Pane eventKey="login">
                      <div className="login-form-container">
                        <div className="login-register-form">
                          <Form<LoginFormTypes>
                            layout="vertical"
                            form={form}
                            onFinish={(values) => login(values)}
                            requiredMark={false}
                            initialValues={{
                              remember: false,
                            }}
                            {...formProps}
                          >
                            <Form.Item
                              name="email"
                              rules={[
                                {
                                  required: true,
                                  message: "Please enter your email address",
                                },
                                {
                                  type: "email",
                                  message: (
                                    <span>
                                      Invalid email address. Please enter a
                                      valid email format.
                                    </span>
                                  ),
                                },
                              ]}
                            >
                              <input type="text" placeholder="Email" />
                            </Form.Item>
                            <Form.Item
                              name="password"
                              rules={[{ required: true }]}
                            >
                              <input type="password" placeholder="Mật khẩu" />
                            </Form.Item>
                            <div className="button-box">
                              <div className="login-toggle-btn">
                                <input type="checkbox" />
                                <label className="ml-10">
                                  Lưu thông tin đăng nhập
                                </label>
                                <Link to={"/"}>Quên mật khẩu?</Link>
                              </div>
                              <button type="submit">
                                <span>Đăng nhập</span>
                              </button>
                            </div>
                          </Form>
                        </div>
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="register">
                      <div className="login-form-container">
                        <div className="login-register-form">
                          <form>
                            <input
                              name="user-email"
                              placeholder="Email"
                              type="email"
                            />
                            <input
                              type="password"
                              name="user-password"
                              placeholder="Mật khẩu"
                            />
                            <div className="button-box">
                              <button type="submit">
                                <span>Đăng ký</span>
                              </button>
                            </div>
                          </form>
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

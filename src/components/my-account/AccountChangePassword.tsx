import { useTranslate, useUpdatePassword } from "@refinedev/core";
import { Form } from "antd";
import clsx from "clsx";
import { useState } from "react";
import { Accordion } from "react-bootstrap";
import { validateCommon } from "../../helpers/validate";

type AccountChangePasswordProps = {};

type updatePasswordVariables = {
  password: string;
  confirm: string;
  oldPassword: string;
};

const AccountChangePassword: React.FC<AccountChangePasswordProps> = ({}) => {
  const t = useTranslate();
  const { mutate: updatePassword } =
    useUpdatePassword<updatePasswordVariables>();

  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [userPasswordForm] = Form.useForm<updatePasswordVariables>();

  const updateUserPassword = (values: updatePasswordVariables) => {
    updatePassword(values, {
      onSuccess: (data) => {
        if (!data.success) {
          // handle error
        }
      },
    });
  };

  const handleTogglePassword = (field: string) => {
    if (field === "password") {
      setShowPassword((prevShowPassword) => !prevShowPassword);
    } else if (field === "confirm") {
      setShowConfirmPassword(
        (prevShowConfirmPassword) => !prevShowConfirmPassword
      );
    } else if (field === "old") {
      setShowOldPassword((prevShowOldPassword) => !prevShowOldPassword);
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
      />
      <span
        className={getPasswordEyeIconClass(showPassword)}
        onClick={() => handleTogglePassword("password")}
      />
    </div>
  );

  const OldPasswordField = (props: any) => (
    <div>
      <input
        {...props}
        id={Math.random()}
        type={showOldPassword ? "text" : "password"}
      />
      <span
        className={getPasswordEyeIconClass(showOldPassword)}
        onClick={() => handleTogglePassword("old")}
      />
    </div>
  );

  const ConfirmField = (props: any) => (
    <div>
      <input
        {...props}
        id={Math.random()}
        type={showConfirmPassword ? "text" : "password"}
      />
      <span
        className={getPasswordEyeIconClass(showConfirmPassword)}
        onClick={() => handleTogglePassword("confirm")}
      />
    </div>
  );

  return (
    <Accordion.Item eventKey="1" className="single-my-account mb-20">
      <Accordion.Header className="panel-heading">
        <span>2 .</span> {t("my_account.change_password.title")}
      </Accordion.Header>
      <Accordion.Body>
        <div className="myaccount-info-wrapper">
          <div className="account-info-wrapper">
            <h5>{t("my_account.change_password.labels.change_password")}</h5>
          </div>
          <Form<updatePasswordVariables>
            layout="vertical"
            onFinish={(values) => updateUserPassword(values)}
            form={userPasswordForm}
            initialValues={{
              oldPassword: "",
              password: "",
              confirm: "",
            }}
          >
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="billing-info">
                  <label>
                    {t("my_account.change_password.fields.oldPassword")}
                  </label>
                  <Form.Item
                    name="oldPassword"
                    rules={[
                      {
                        validator: (_, value) =>
                          validateCommon(_, value, t, "oldPassword"),
                      },
                    ]}
                  >
                    <OldPasswordField />
                  </Form.Item>
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="billing-info">
                  <label>
                    {t("my_account.change_password.fields.password")}
                  </label>
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
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="billing-info">
                  <label>
                    {t("my_account.change_password.fields.confirm")}
                  </label>
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
                          if (!value || getFieldValue("password") === value) {
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
                </div>
              </div>
            </div>
            <div className="billing-back-btn">
              <div className="billing-btn">
                <button type="submit">{t("buttons.save_changes")}</button>
              </div>
            </div>
          </Form>
        </div>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default AccountChangePassword;

import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { getValueFromEvent } from "@refinedev/antd";
import { useTranslate, useUpdate } from "@refinedev/core";
import { Avatar, Form, Upload } from "antd";
import {
  RcFile,
  UploadChangeParam,
  UploadFile,
  UploadProps,
} from "antd/es/upload";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { toTimeStamp } from "../../helpers/date";
import { getBase64Image } from "../../helpers/image";
import { showErrorToast } from "../../helpers/toast";
import {
  validateCommon,
  validateEmail,
  validateFullName,
} from "../../helpers/validate";
import { ICustomerRequest, ICustomerResponse } from "../../interfaces";
import dayjs from "dayjs";

type AccountInforProps = {
  data: ICustomerResponse | undefined;
  refetch: any;
};

const AccountInfor: React.FC<AccountInforProps> = ({ data, refetch }) => {
  const t = useTranslate();
  const { mutate: update, isLoading: isLoadingUpdate } = useUpdate();

  const [userInfoForm] = Form.useForm<ICustomerRequest>();
  const imageUrl = Form.useWatch("image", userInfoForm);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      const dob = dayjs(new Date(data.dateOfBirth)).format("YYYY-MM-DD");
      userInfoForm.setFieldsValue({
        fullName: data ? data.fullName : "",
        dateOfBirth: data ? dob : "",
        email: data ? data.email : "",
        gender: data ? data.gender : "",
        image: data ? data.image : "",
      });
    }
  }, [data]);

  const updateUserInfo = (values: ICustomerRequest) => {
    update(
      {
        resource: "customers",
        values: {
          ...data,
          fullName: values.fullName ?? data?.fullName,
          email: values.email ?? data?.email,
          gender: values.gender ?? data?.gender,
          image: values.image ?? data?.image,
          dateOfBirth:
            toTimeStamp(values.dateOfBirth as string) ?? data?.dateOfBirth,
        },
        id: data?.id as any,
        successNotification: (data, values, resource) => {
          return {
            message: t("my_account.account_infor.messages.success"),
            description: t("common.success"),
            type: "success",
          };
        },
        errorNotification: (error: any) => {
          return {
            message: t("common.error") + error.message,
            description: "Oops",
            type: "error",
          };
        },
      },
      {
        onError: (error, variables, context) => {},
        onSuccess: (data, variables, context) => {
          refetch();
        },
      }
    );
  };

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      showErrorToast(t("image.error.invalid"));
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      showErrorToast(t("image.error.exceed"));
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64Image(info.file.originFileObj as RcFile, (url) => {
        setLoading(false);
        console.log(url);

        userInfoForm.setFieldValue("image", url);
      });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>{t("image.upload")}</div>
    </div>
  );

  return (
    <Accordion.Item eventKey="0" className="single-my-account mb-20">
      <Accordion.Header className="panel-heading">
        <span>1 .</span> {t("my_account.account_infor.title")}
      </Accordion.Header>
      <Accordion.Body>
        <Form
          layout="vertical"
          onFinish={(values) => updateUserInfo(values)}
          form={userInfoForm}
          initialValues={{
            fullName: "",
            dateOfBirth: "",
            email: "",
            gender: "",
            image: "",
          }}
        >
          <div className="myaccount-info-wrapper">
            <div className="account-info-wrapper">
              <h5>{t("my_account.account_infor.labels.your_infor")}</h5>
            </div>
            <div className="row">
              <div className="col-12 text-center mb-3">
                <Form.Item
                  name="image"
                  valuePropName="file"
                  getValueFromEvent={getValueFromEvent}
                  noStyle
                >
                  <Upload
                    name="file"
                    listType="picture-circle"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                    maxCount={1}
                    customRequest={({ onSuccess, onError, file }) => {
                      if (onSuccess) {
                        try {
                          onSuccess("ok");
                        } catch (error) {}
                      }
                    }}
                  >
                    {imageUrl ? (
                      <Avatar
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                        src={imageUrl}
                        alt="User avatar"
                      />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </Form.Item>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="billing-info">
                  <label>{t("my_account.account_infor.fields.name")}</label>
                  <Form.Item
                    name="fullName"
                    rules={[
                      {
                        validator: validateFullName,
                      },
                    ]}
                  >
                    <input type="text" />
                  </Form.Item>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="billing-info">
                  <label>
                    {t("my_account.account_infor.fields.dateOfBirth")}
                  </label>
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
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="billing-info">
                  <label>{t("my_account.account_infor.fields.email")}</label>
                  <Form.Item
                    name="email"
                    rules={[
                      {
                        validator: validateEmail,
                      },
                    ]}
                  >
                    <input id="email-userinfo" type="email" />
                  </Form.Item>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="billing-select">
                  <label>
                    {t("my_account.account_infor.fields.gender.label")}
                  </label>
                  <Form.Item
                    name="gender"
                    rules={[
                      {
                        validator: (_, value) =>
                          validateCommon(_, value, t, "gender"),
                      },
                    ]}
                  >
                    <select name="gender">
                      <option value="">
                        --
                        {t(
                          "my_account.account_infor.fields.gender.placeholder"
                        )}
                        --
                      </option>
                      <option value="Male">
                        {t("my_account.account_infor.fields.gender.male")}
                      </option>
                      <option value="Female">
                        {t("my_account.account_infor.fields.gender.female")}
                      </option>
                      <option value="Other">
                        {t("my_account.account_infor.fields.gender.other")}
                      </option>
                    </select>
                  </Form.Item>
                </div>
              </div>
            </div>
            <div className="billing-back-btn">
              <div className="billing-btn">
                <button
                  className={clsx({ loading: isLoadingUpdate })}
                  type="submit"
                >
                  <span className="loading me-3">
                    <LoadingOutlined />
                  </span>
                  {t("buttons.save_changes")}
                </button>
              </div>
            </div>
          </div>
        </Form>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default AccountInfor;

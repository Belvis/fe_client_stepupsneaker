import { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import {
  HttpError,
  useApiUrl,
  useCustomMutation,
  useDelete,
  useGetIdentity,
  useList,
  useUpdate,
  useUpdatePassword,
} from "@refinedev/core";
import clsx from "clsx";
import {
  Badge,
  Form,
  Spin,
  List as AntdList,
  Upload,
  message,
  Avatar,
  Row,
  Col,
  Image,
  Button,
  Typography,
  Card,
} from "antd";
import {
  IAddressResponse,
  ICustomerRequest,
  ICustomerResponse,
  IVoucherResponse,
} from "../../interfaces";
import dayjs from "dayjs";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { CurrencyFormatter } from "../../helpers/currency";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { getValueFromEvent, useModalForm } from "@refinedev/antd";
import {
  RcFile,
  UploadChangeParam,
  UploadFile,
  UploadProps,
} from "antd/es/upload";
import { getBase64Image } from "../../helpers/image";
import { CreateAddressModal } from "../../components/address/CreateAddressModal";
import { EditAddressModal } from "../../components/address/EditAddressModal";
import Voucher from "../../components/voucher/Voucher";

type updatePasswordVariables = {
  password: string;
  confirm: string;
  oldPassword: string;
};

const { Text, Title } = Typography;

const MyAccount = () => {
  const { t } = useTranslation();
  const API_URL = useApiUrl();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const [userInfoForm] = Form.useForm<ICustomerRequest>();
  const [userPasswordForm] = Form.useForm<updatePasswordVariables>();

  const imageUrl = Form.useWatch("image", userInfoForm);

  const setTitle = useDocumentTitle();

  useEffect(() => {
    setTitle(t("nav.pages.my_account") + " | SUNS");
  }, [t]);

  const currency = useSelector((state: RootState) => state.currency);

  let { pathname } = useLocation();

  const { mutate: update, isLoading: isLoadingUpdate } = useUpdate();
  const { mutate: setDefault } = useCustomMutation<IAddressResponse>();
  const { mutate: remove } = useDelete();
  const { mutate: updatePassword } =
    useUpdatePassword<updatePasswordVariables>();

  const { data, refetch } = useGetIdentity<ICustomerResponse>();

  const {
    data: dataV,
    isLoading: isLoadingVoucher,
    isError,
  } = useList<IVoucherResponse, HttpError>({
    resource: "vouchers",
    pagination: {
      pageSize: 1000,
    },
  });

  const vouchers = dataV?.data ? dataV?.data : [];

  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
            message: `Thay đổi thông tin cá nhân thành công!`,
            description: "Thành công",
            type: "success",
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

  const updateUserPassword = (values: updatePasswordVariables) => {
    updatePassword(values, {
      onSuccess: (data) => {
        if (!data.success) {
          // handle error
        }
      },
    });
  };

  const removeAddress = (id: string) => {
    remove(
      {
        resource: "addresses",
        id,
      },
      {
        onError: (error, variables, context) => {},
        onSuccess: (data, variables, context) => {
          refetch();
        },
      }
    );
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      messageApi.open({
        type: "error",
        content: "You can only upload JPG/PNG file!",
      });
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      messageApi.open({
        type: "error",
        content: "Image must smaller than 2MB!",
      });
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

  const {
    modalProps: createModalProps,
    formProps: createFormProps,
    show: createModalShow,
    onFinish: createOnFinish,
    close: createModalClose,
  } = useModalForm<IAddressResponse>({
    resource: "addresses",
    onMutationSuccess: () => {
      createFormProps.form?.resetFields();
      refetch().then(() => {
        createModalClose();
      });
    },
    autoSubmitClose: true,
    autoResetForm: true,
    action: "create",
    redirect: false,
    warnWhenUnsavedChanges: false,
  });

  const {
    modalProps: editModalProps,
    formProps: editFormProps,
    show: editModalShow,
    onFinish: editOnFinish,
    close: editModalClose,
  } = useModalForm<IAddressResponse>({
    resource: "addresses",
    onMutationSuccess: () => {
      refetch().then(() => {
        editModalClose();
      });
    },
    action: "edit",
    redirect: false,
    autoSubmitClose: true,
    warnWhenUnsavedChanges: false,
    successNotification: (data, values, resource) => {
      return {
        message: `Cập nhật địa chỉ thành công!`,
        description: "Thành công",
        type: "success",
      };
    },
  });

  function toTimeStamp(date: string) {
    return dayjs(date).valueOf();
  }

  function renderItem(item: IVoucherResponse) {
    return (
      <AntdList.Item key={item.id}>
        <Voucher item={item} currency={currency} type="copy" close={() => {}} />
      </AntdList.Item>
    );
  }

  function handleAddressSetDefault(id: string) {
    const apiUrl = `${API_URL}/addresses/set-default-address?address=${id}`;

    setDefault(
      {
        url: apiUrl,
        method: "put",
        values: { address: id },
        successNotification: () => ({
          message: "Successfully set default.",
          description: "Success with no errors",
          type: "success",
        }),
        errorNotification: () => ({
          message: "Something went wrong when setting default address",
          description: "Error",
          type: "error",
        }),
      },
      {
        onSuccess: () => {
          // Assuming refetch is a function that fetches data again
          refetch();
        },
      }
    );
  }

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
    <Fragment>
      {contextHolder}
      <Breadcrumb
        pages={[
          { label: "home", path: "/" },
          { label: "pages.my_account", path: pathname },
        ]}
      />
      <div className="myaccount-area pb-80 pt-100 bg-white">
        <Spin tip="Loading" size="small" spinning={!data}>
          <div className="container">
            <div className="row">
              <div className="ms-auto me-auto col-lg-9">
                <div className="myaccount-wrapper">
                  <Accordion defaultActiveKey="0">
                    <Accordion.Item
                      eventKey="0"
                      className="single-my-account mb-20"
                    >
                      <Accordion.Header className="panel-heading">
                        <span>1 .</span> Chỉnh sửa thông tin tài khoản{" "}
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
                              <h5>Thông tin cá nhân của bạn</h5>
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
                                    customRequest={({
                                      onSuccess,
                                      onError,
                                      file,
                                    }) => {
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
                                  <label>Tên</label>
                                  <Form.Item
                                    name="fullName"
                                    rules={[
                                      {
                                        required: true,
                                        whitespace: true,
                                        message:
                                          "Họ và tên không được để trống!",
                                      },
                                    ]}
                                  >
                                    <input type="text" />
                                  </Form.Item>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="billing-info">
                                  <label>Ngày sinh</label>
                                  <Form.Item
                                    name="dateOfBirth"
                                    rules={[
                                      {
                                        required: true,
                                        message:
                                          "Ngày sinh không được để trống!",
                                        type: "date",
                                      },
                                    ]}
                                  >
                                    <input type="date" />
                                  </Form.Item>
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>Email</label>
                                  <Form.Item
                                    name="email"
                                    rules={[
                                      {
                                        required: true,
                                        whitespace: true,
                                        message: "Email không được để trống!",
                                        type: "email",
                                      },
                                    ]}
                                  >
                                    <input id="email-userinfo" type="email" />
                                  </Form.Item>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="billing-select">
                                  <label>Giới tính</label>
                                  <Form.Item
                                    name="gender"
                                    rules={[
                                      {
                                        required: true,
                                        message:
                                          "Giới tính không được để trống!",
                                      },
                                    ]}
                                  >
                                    <select name="gender">
                                      <option value="">
                                        --Chọn giới tính--
                                      </option>
                                      <option value="Male">Nam</option>
                                      <option value="Female">Nữ</option>
                                      <option value="Other">Khác</option>
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
                                  Lưu thay đổi
                                </button>
                              </div>
                            </div>
                          </div>
                        </Form>
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item
                      eventKey="1"
                      className="single-my-account mb-20"
                    >
                      <Accordion.Header className="panel-heading">
                        <span>2 .</span> Đổi mật khẩu
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="myaccount-info-wrapper">
                          <div className="account-info-wrapper">
                            <h5>Nhập thông tin để thay đổi mật khẩu</h5>
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
                                  <label>Mật khẩu cũ</label>
                                  <Form.Item
                                    name="oldPassword"
                                    rules={[
                                      {
                                        whitespace: true,
                                        required: true,
                                      },
                                    ]}
                                  >
                                    <OldPasswordField />
                                  </Form.Item>
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>Mật khẩu mới</label>
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
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>Xác nhận mật khẩu mới</label>
                                  <Form.Item
                                    name="confirm"
                                    dependencies={["password"]}
                                    hasFeedback
                                    rules={[
                                      {
                                        required: true,
                                        message:
                                          "Please confirm your password!",
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
                                </div>
                              </div>
                            </div>
                            <div className="billing-back-btn">
                              <div className="billing-btn">
                                <button type="submit">Lưu thay đổi</button>
                              </div>
                            </div>
                          </Form>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item
                      eventKey="2"
                      className="single-my-account mb-20"
                    >
                      <Accordion.Header className="panel-heading">
                        <span>3 .</span> Sửa đổi danh sách địa chỉ
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="myaccount-info-wrapper">
                          <div className="account-info-wrapper row">
                            <div className="col">
                              <h5>Danh sách địa chỉ</h5>
                            </div>
                            <div className="col text-end">
                              <button
                                onClick={() => {
                                  createFormProps.form?.resetFields();
                                  createModalShow();
                                }}
                              >
                                Thêm địa chỉ mới
                              </button>
                            </div>
                          </div>
                          {data && data.addressList
                            ? data.addressList
                                .sort((a, b) =>
                                  a.isDefault === b.isDefault
                                    ? 0
                                    : a.isDefault
                                    ? -1
                                    : 1
                                )
                                .map((address) => {
                                  const {
                                    phoneNumber,
                                    provinceName,
                                    districtName,
                                    wardName,
                                    more,
                                    isDefault,
                                    id,
                                  } = address;

                                  return (
                                    <div
                                      className="entries-wrapper mb-3"
                                      key={id}
                                    >
                                      <Badge.Ribbon
                                        key={id}
                                        text="Mặc định"
                                        placement="start"
                                        color="green"
                                        style={{
                                          display: isDefault ? "" : "none",
                                        }}
                                      >
                                        <div className="row">
                                          <div className="col-lg-6 col-md-6 d-flex align-items-center">
                                            <div className="entries-info">
                                              <div className="row">
                                                <div className="col fw-bold">
                                                  Số điện thoại:
                                                </div>
                                                <div className="col text-end">
                                                  {phoneNumber}
                                                </div>
                                              </div>
                                              <div className="row">
                                                <div className="col fw-bold">
                                                  Tỉnh/thành phố:
                                                </div>
                                                <div className="col text-end">
                                                  {provinceName}
                                                </div>
                                              </div>
                                              <div className="row">
                                                <div className="col fw-bold">
                                                  Quận/huyện:
                                                </div>
                                                <div className="col text-end">
                                                  {districtName}
                                                </div>
                                              </div>
                                              <div className="row">
                                                <div className="col fw-bold">
                                                  Phường/xã:
                                                </div>
                                                <div className="col text-end">
                                                  {wardName}
                                                </div>
                                              </div>
                                              <div className="row">
                                                <div className="col fw-bold">
                                                  Chi tiết:
                                                </div>
                                                <div className="col text-end">
                                                  {more}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center">
                                            <div className="entries-edit-delete text-center">
                                              <button
                                                className="edit"
                                                onClick={() =>
                                                  editModalShow(id)
                                                }
                                              >
                                                Sửa
                                              </button>
                                              <button
                                                className="edit"
                                                onClick={() =>
                                                  handleAddressSetDefault(id)
                                                }
                                                disabled={isDefault}
                                              >
                                                Đặt mặc định
                                              </button>
                                              <button
                                                onClick={() =>
                                                  removeAddress(id)
                                                }
                                              >
                                                Xoá
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </Badge.Ribbon>
                                    </div>
                                  );
                                })
                            : "Bạn chưa có địa chỉ, vui lòng tạo địa chỉ trước."}
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item
                      eventKey="3"
                      className="single-my-account mb-20"
                    >
                      <Accordion.Header className="panel-heading">
                        <span>4 .</span> Ví voucher của bạn
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="myaccount-info-wrapper">
                          <div className="account-info-wrapper">
                            <h5>Danh sách voucher dành cho bạn</h5>
                          </div>
                          {/* <div className="voucher-card"> */}
                          <AntdList
                            itemLayout="horizontal"
                            dataSource={vouchers}
                            renderItem={renderItem}
                            loading={isLoadingVoucher}
                          />
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </Spin>
      </div>
      <CreateAddressModal
        onFinish={createOnFinish}
        modalProps={createModalProps}
        formProps={createFormProps}
        customer={data}
      />
      <EditAddressModal
        onFinish={editOnFinish}
        modalProps={editModalProps}
        formProps={editFormProps}
      />
    </Fragment>
  );
};

export default MyAccount;

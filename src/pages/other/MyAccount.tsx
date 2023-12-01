import { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import { HttpError, useGetIdentity, useList, useUpdate } from "@refinedev/core";
import { Badge, Form, Spin, List as AntdList } from "antd";
import {
  ICustomerRequest,
  ICustomerResponse,
  IVoucherResponse,
} from "../../interfaces";
import dayjs from "dayjs";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";

const MyAccount = () => {
  const { t } = useTranslation();

  useDocumentTitle(t("nav.pages.my_account") + " | SUNS");
  const currency = useSelector((state: RootState) => state.currency);

  let { pathname } = useLocation();

  const { mutate: update } = useUpdate();

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

  const [userInfoForm] = Form.useForm<ICustomerRequest>();

  useEffect(() => {
    if (data) {
      const dob = dayjs(new Date(data.dateOfBirth)).format("YYYY-MM-DD");
      userInfoForm.setFieldsValue({
        fullName: data ? data.fullName : "",
        email: data ? data.email : "",
        dateOfBirth: data ? dob : "",
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
          dateOfBirth:
            toTimeStamp(values.dateOfBirth as string) ?? data?.dateOfBirth,
        },
        id: data?.id as any,
      },
      {
        onError: (error, variables, context) => {},
        onSuccess: (data, variables, context) => {
          refetch();
        },
      }
    );
  };

  function toTimeStamp(date: string) {
    return dayjs(date).valueOf();
  }

  function renderItem(item: IVoucherResponse) {
    const { id, code, value, constraint, image, endDate, quantity, type } =
      item;

    const constraintPrice = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.currencyName,
      currencyDisplay: "symbol",
    }).format(constraint);
    const cashPrice =
      type === "CASH"
        ? new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency.currencyName,
            currencyDisplay: "symbol",
          }).format(value)
        : 0;

    const handleCopyCode = () => {
      if (code) {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    };

    return (
      <AntdList.Item actions={[]}>
        <AntdList.Item.Meta title={""} description={""} />
        <div className="coupon-container">
          <div className="coupon-card">
            <img src={image} className="logo" />
            {type === "PERCENTAGE" ? (
              <h3>
                Giảm giá {value}% cho đơn hàng trên {constraintPrice}
                <br />
                Nhân ngày t1 vô địch
              </h3>
            ) : (
              <h3>
                Giảm giá {cashPrice} cho đơn hàng trên {constraintPrice}
                <br />
                Nhân ngày t1 vô địch
              </h3>
            )}
            <div className="coupon-row">
              <span id="cpnCode">{code}</span>
              <span id="cpnBtn" onClick={handleCopyCode}>
                {copied ? "COPIED" : "COPY CODE"}
              </span>
            </div>
            <p>Có hạn tới: {dayjs(new Date(endDate)).format("lll")}</p>
            <div className="circle1"></div>
            <div className="circle2"></div>
          </div>
        </div>
      </AntdList.Item>
    );
  }

  return (
    <Fragment>
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
                          form={userInfoForm}
                          onFinish={(values) => updateUserInfo(values)}
                          requiredMark={false}
                        >
                          <div className="myaccount-info-wrapper">
                            <div className="account-info-wrapper">
                              <h5>Thông tin cá nhân của bạn</h5>
                            </div>
                            <div className="row">
                              <div className="col-lg-6 col-md-6">
                                <div className="billing-info">
                                  <label>Tên</label>
                                  <Form.Item
                                    name="fullName"
                                    rules={[
                                      {
                                        required: true,
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
                                        message: "Email không được để trống!",
                                      },
                                    ]}
                                  >
                                    <input type="email" />
                                  </Form.Item>
                                </div>
                              </div>
                            </div>
                            <div className="billing-back-btn">
                              <div className="billing-btn">
                                <button type="submit">Lưu thay đổi</button>
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
                          <div className="row">
                            <div className="col-lg-12 col-md-12">
                              <div className="billing-info">
                                <label>Mật khẩu cũ</label>
                                <input type="password" />
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                              <div className="billing-info">
                                <label>Mật khẩu mới</label>
                                <input type="password" />
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                              <div className="billing-info">
                                <label>Xác nhận mật khẩu mới</label>
                                <input type="password" />
                              </div>
                            </div>
                          </div>
                          <div className="billing-back-btn">
                            <div className="billing-btn">
                              <button type="submit">Lưu thay đổi</button>
                            </div>
                          </div>
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
                          <div className="account-info-wrapper">
                            <h5>Danh sách địa chỉ</h5>
                          </div>
                          {data && data.addressList ? (
                            <div className="entries-wrapper">
                              {data.addressList.map((address) => {
                                const {
                                  phoneNumber,
                                  provinceName,
                                  districtName,
                                  wardName,
                                  more,
                                  isDefault,
                                } = address;
                                return (
                                  <Badge.Ribbon
                                    text="Mặc định"
                                    placement="start"
                                    color="green"
                                    style={{ display: isDefault ? "" : "none" }}
                                  >
                                    <div className="row">
                                      <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-start">
                                        <div className="entries-info">
                                          <p>Số điện thoại: {phoneNumber}</p>
                                          <p>Tỉnh/thành phố: {provinceName}</p>
                                          <p>Quận/huyện: {districtName}</p>
                                          <p>Phường/xã: {wardName}</p>
                                          <p>Chi tiết: {more}</p>
                                        </div>
                                      </div>
                                      <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center">
                                        <div className="entries-edit-delete text-center">
                                          <button className="edit">Sửa</button>
                                          <button className="edit">
                                            Đặt mặc định
                                          </button>
                                          <button>Xoá</button>
                                        </div>
                                      </div>
                                    </div>
                                  </Badge.Ribbon>
                                );
                              })}
                            </div>
                          ) : (
                            "Bạn chưa có địa chỉ, vui lòng tạo địa chỉ trước."
                          )}
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
                          <div className="entries-wrapper">
                            <AntdList
                              itemLayout="horizontal"
                              dataSource={vouchers}
                              renderItem={renderItem}
                              loading={isLoadingVoucher}
                            />
                          </div>
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
    </Fragment>
  );
};

export default MyAccount;

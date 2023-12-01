import { Fragment } from "react";
import { useLocation } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import { useGetIdentity } from "@refinedev/core";

const MyAccount = () => {
  const { t } = useTranslation();

  useDocumentTitle(t("nav.pages.my_account") + " | SUNS");

  let { pathname } = useLocation();

  const { data } = useGetIdentity<any>();

  console.log(data);

  return (
    <Fragment>
      <Breadcrumb
        pages={[
          { label: "home", path: "/" },
          { label: "pages.my_account", path: pathname },
        ]}
      />
      <div className="myaccount-area pb-80 pt-100 bg-white">
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
                      <div className="myaccount-info-wrapper">
                        <div className="account-info-wrapper">
                          <h5>Thông tin cá nhân của bạn</h5>
                        </div>
                        <div className="row">
                          <div className="col-lg-6 col-md-6">
                            <div className="billing-info">
                              <label>Tên</label>
                              <input type="text" />
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="billing-info">
                              <label>Ngày sinh</label>
                              <input type="text" />
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12">
                            <div className="billing-info">
                              <label>Email</label>
                              <input type="email" />
                            </div>
                          </div>
                          {/* <div className="col-lg-6 col-md-6">
                            <div className="billing-info">
                              <label>Telephone</label>
                              <input type="text" />
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="billing-info">
                              <label>Fax</label>
                              <input type="text" />
                            </div>
                          </div> */}
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
                        <div className="entries-wrapper">
                          <div className="row">
                            <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center">
                              <div className="entries-info text-center">
                                <p>John Doe</p>
                                <p>Paul Park </p>
                                <p>Lorem ipsum dolor set amet</p>
                                <p>NYC</p>
                                <p>New York</p>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center">
                              <div className="entries-edit-delete text-center">
                                <button className="edit">Sửa</button>
                                <button>Xoá</button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="billing-back-btn">
                          <div className="billing-btn">
                            <button type="submit">Continue</button>
                          </div>
                        </div>
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
                          <div className="row">
                            <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center">
                              <div className="entries-info text-center">
                                <p>John Doe</p>
                                <p>Paul Park </p>
                                <p>Lorem ipsum dolor set amet</p>
                                <p>NYC</p>
                                <p>New York</p>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center">
                              <div className="entries-edit-delete text-center">
                                <button className="edit">Sửa</button>
                                <button>Xoá</button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="billing-back-btn">
                          <div className="billing-btn">
                            <button type="submit">Continue</button>
                          </div>
                        </div>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
    </Fragment>
  );
};

export default MyAccount;

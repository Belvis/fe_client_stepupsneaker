import { Fragment } from "react";
import { useLocation } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@refinedev/react-router-v6";

const MyAccount = () => {
  const { t } = useTranslation();

  useDocumentTitle(t("nav.pages.my_account") + " | SUNS");

  let { pathname } = useLocation();

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
                      <span>1 .</span> Edit your account information{" "}
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="myaccount-info-wrapper">
                        <div className="account-info-wrapper">
                          <h4>My Account Information</h4>
                          <h5>Your Personal Details</h5>
                        </div>
                        <div className="row">
                          <div className="col-lg-6 col-md-6">
                            <div className="billing-info">
                              <label>First Name</label>
                              <input type="text" />
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="billing-info">
                              <label>Last Name</label>
                              <input type="text" />
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12">
                            <div className="billing-info">
                              <label>Email Address</label>
                              <input type="email" />
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
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
                    eventKey="1"
                    className="single-my-account mb-20"
                  >
                    <Accordion.Header className="panel-heading">
                      <span>2 .</span> Change your password
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="myaccount-info-wrapper">
                        <div className="account-info-wrapper">
                          <h4>Change Password</h4>
                          <h5>Your Password</h5>
                        </div>
                        <div className="row">
                          <div className="col-lg-12 col-md-12">
                            <div className="billing-info">
                              <label>Password</label>
                              <input type="password" />
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12">
                            <div className="billing-info">
                              <label>Password Confirm</label>
                              <input type="password" />
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
                    eventKey="2"
                    className="single-my-account mb-20"
                  >
                    <Accordion.Header className="panel-heading">
                      <span>3 .</span> Modify your address book entries
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="myaccount-info-wrapper">
                        <div className="account-info-wrapper">
                          <h4>Address Book Entries</h4>
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
                                <button className="edit">Edit</button>
                                <button>Delete</button>
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

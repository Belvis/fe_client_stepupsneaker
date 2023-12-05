import { Fragment } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import GoogleMap from "../../components/google-map";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import { useTranslation } from "react-i18next";

const Contact = () => {
  let { pathname } = useLocation();
  const { t } = useTranslation();

  useDocumentTitle(t("nav.contact_us") + " | SUNS");

  return (
    <Fragment>
      <Breadcrumb
        pages={[
          { label: "home", path: "/" },
          { label: "contact_us", path: pathname },
        ]}
      />
      <div className="contact-area pt-100 pb-100 bg-white">
        <div className="container">
          <div className="contact-map mb-10">
            <GoogleMap lat={47.444} lng={-122.176} />
          </div>
          <div className="custom-row-2">
            <div className="col-12 col-lg-4 col-md-5">
              <div className="contact-info-wrap">
                <div className="single-contact-info">
                  <div className="contact-icon">
                    <i className="fa fa-phone" />
                  </div>
                  <div className="contact-info-dec">
                    <p>+84 098 765 4321</p>
                    <p>+84 098 765 4321</p>
                  </div>
                </div>
                <div className="single-contact-info">
                  <div className="contact-icon">
                    <i className="fa fa-globe" />
                  </div>
                  <div className="contact-info-dec">
                    <p>
                      <a href="mailto:stepupnow_support@email.com">
                        sus_support@email.com
                      </a>
                    </p>
                    <p>
                      <a href="https://stepupsneaker.pro">stepupsneaker.pro</a>
                    </p>
                  </div>
                </div>
                <div className="single-contact-info">
                  <div className="contact-icon">
                    <i className="fa fa-map-marker" />
                  </div>
                  <div className="contact-info-dec">
                    <p>FPT Polytechnic, Hà Nội</p>
                    <p>13 phố Trịnh Văn Bô</p>
                  </div>
                </div>
                <div className="contact-social text-center">
                  <h3>Theo dõi chúng tôi</h3>
                  <ul>
                    <li>
                      <a href="//facebook.com">
                        <i className="fa fa-facebook" />
                      </a>
                    </li>
                    <li>
                      <a href="//pinterest.com">
                        <i className="fa fa-pinterest-p" />
                      </a>
                    </li>
                    <li>
                      <a href="//thumblr.com">
                        <i className="fa fa-tumblr" />
                      </a>
                    </li>
                    <li>
                      <a href="//vimeo.com">
                        <i className="fa fa-vimeo" />
                      </a>
                    </li>
                    <li>
                      <a href="//twitter.com">
                        <i className="fa fa-twitter" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-8 col-md-7">
              <div className="contact-form">
                <div className="contact-title mb-30">
                  <h2>Giữ liên lạc</h2>
                </div>
                <form className="contact-form-style">
                  <div className="row">
                    <div className="col-lg-6">
                      <input name="name" placeholder="Tên*" type="text" />
                    </div>
                    <div className="col-lg-6">
                      <input name="email" placeholder="Email*" type="email" />
                    </div>
                    <div className="col-lg-12">
                      <input name="subject" placeholder="Chủ đề*" type="text" />
                    </div>
                    <div className="col-lg-12">
                      <textarea
                        name="message"
                        placeholder="Lời nhắn*"
                        defaultValue={""}
                      />
                      <button className="submit" type="submit">
                        Gửi
                      </button>
                    </div>
                  </div>
                </form>
                <p className="form-message" />
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
    </Fragment>
  );
};

export default Contact;

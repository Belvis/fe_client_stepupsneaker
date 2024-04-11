import { CONTACT_EMAIL, CONTACT_PHONE_NUMBER } from "../../../constants";

const MobileWidgets = () => {
  return (
    <div className="offcanvas-widget-area">
      <div className="off-canvas-contact-widget">
        <div className="header-contact-info">
          <ul className="header-contact-info__list">
            <li>
              <i className="fa fa-phone"></i>{" "}
              <a href="tel://12452456012">{CONTACT_PHONE_NUMBER} </a>
            </li>
            <li>
              <i className="fa fa-envelope"></i>{" "}
              <a href="mailto:info@yourdomain.com">{CONTACT_EMAIL}</a>
            </li>
          </ul>
        </div>
      </div>
      {/*Off Canvas Widget Social Start*/}
      <div className="off-canvas-widget-social">
        <a href="//twitter.com" title="Twitter">
          <i className="fa fa-twitter"></i>
        </a>
        <a href="//instagram.com" title="Instagram">
          <i className="fa fa-instagram"></i>
        </a>
        <a href="//facebook.com" title="Facebook">
          <i className="fa fa-facebook"></i>
        </a>
        <a href="//pinterest.com" title="Pinterest">
          <i className="fa fa-pinterest"></i>
        </a>
      </div>
      {/*Off Canvas Widget Social End*/}
    </div>
  );
};

export default MobileWidgets;

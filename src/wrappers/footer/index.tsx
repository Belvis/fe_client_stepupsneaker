import PropTypes from "prop-types";
import clsx from "clsx";
import { Link } from "react-router-dom";
import FooterCopyright from "../../components/footer/FooterCopyright";
import FooterNewsletter from "../../components/footer/FooterNewsletter";
import { useTranslation } from "react-i18next";

type FooterProps = {
  backgroundColorClass?: string;
  containerClass?: string;
  extraFooterClass?: string;
  sideMenu?: boolean;
  spaceBottomClass?: string;
  spaceTopClass?: string;
  spaceLeftClass?: string;
  spaceRightClass?: string;
};

export const Footer: React.FC<FooterProps> = ({
  backgroundColorClass,
  spaceTopClass,
  spaceBottomClass,
  spaceLeftClass,
  spaceRightClass,
  containerClass,
  extraFooterClass,
  sideMenu,
}) => {
  const { t } = useTranslation();

  return (
    <footer
      className={clsx(
        "footer-area",
        backgroundColorClass,
        spaceTopClass,
        spaceBottomClass,
        extraFooterClass,
        spaceLeftClass,
        spaceRightClass
      )}
    >
      <div className={`${containerClass ? containerClass : "container"}`}>
        <div className="row">
          <div
            className={`${
              sideMenu ? "col-xl-2 col-sm-4" : "col-lg-2 col-sm-4"
            }`}
          >
            {/* footer copyright */}
            <FooterCopyright
              footerLogo="/assets/img/logo/logo.png"
              spaceBottomClass="mb-30"
            />
          </div>
          <div
            className={`${
              sideMenu ? "col-xl-2 col-sm-4" : "col-lg-2 col-sm-4"
            }`}
          >
            <div className="footer-widget mb-30 ml-30">
              <div className="footer-title">
                <h3>{t("footer.about_us.title")}</h3>
              </div>
              <div className="footer-list">
                <ul>
                  <li>
                    <Link to={"/about"}>{t("footer.about_us.about_us")}</Link>
                  </li>
                  <li>
                    <Link to={"#/"}>{t("footer.about_us.store_location")}</Link>
                  </li>
                  <li>
                    <Link to={"/contact"}>{t("footer.about_us.contact")}</Link>
                  </li>
                  <li>
                    <Link to={"/orders/tracking"}>
                      {t("footer.about_us.orders_tracking")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div
            className={`${
              sideMenu ? "col-xl-2 col-sm-4" : "col-lg-2 col-sm-4"
            }`}
          >
            <div className="footer-widget mb-30 ml-30">
              <div className="footer-title">
                <h3>{t("footer.usefull_links.title")}</h3>
              </div>
              <div className="footer-list">
                <ul>
                  <li>
                    <Link to={"#/"}>{t("footer.usefull_links.returns")}</Link>
                  </li>
                  <li>
                    <Link to={"#/"}>
                      {t("footer.usefull_links.support_policy")}
                    </Link>
                  </li>
                  <li>
                    <Link to={"#/"}>
                      {t("footer.usefull_links.size_guide")}
                    </Link>
                  </li>
                  <li>
                    <Link to={"#/"}>{t("footer.usefull_links.faqs")}</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div
            className={`${
              sideMenu ? "col-xl-3 col-sm-4" : "col-lg-2 col-sm-6"
            }`}
          >
            <div className="footer-widget mb-30 ml-20">
              <div className="footer-title">
                <h3>{t("footer.follow_us.title")}</h3>
              </div>
              <div className="footer-list">
                <ul>
                  <li>
                    <a
                      href="//www.facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Facebook
                    </a>
                  </li>
                  <li>
                    <a
                      href="//www.twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Twitter
                    </a>
                  </li>
                  <li>
                    <a
                      href="//www.instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a
                      href="//www.youtube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Youtube
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div
            className={`${
              sideMenu ? "col-xl-3 col-sm-8" : "col-lg-4 col-sm-6"
            }`}
          >
            {/* footer newsletter */}
            <FooterNewsletter
              spaceBottomClass="mb-30"
              spaceLeftClass="ml-70"
              sideMenu={sideMenu}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

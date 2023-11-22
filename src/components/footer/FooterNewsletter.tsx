import PropTypes from "prop-types";
import clsx from "clsx";
import SubscribeEmail from "./sub-components/SubscribeEmail";
import { useTranslation } from "react-i18next";

type FooterNewsletterProps = {
  spaceBottomClass?: string;
  spaceLeftClass?: string;
  colorClass?: string;
  sideMenu?: boolean;
  widgetColorClass?: string;
};

const FooterNewsletter: React.FC<FooterNewsletterProps> = ({
  spaceBottomClass,
  spaceLeftClass,
  sideMenu,
  colorClass,
  widgetColorClass,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={clsx(
        "footer-widget",
        spaceBottomClass,
        sideMenu ? "ml-ntv5" : spaceLeftClass,
        widgetColorClass
      )}
    >
      <div className="footer-title">
        <h3>{t("footer.newsletter.title")}</h3>
      </div>
      <div className={clsx("subscribe-style", colorClass)}>
        <p>{t("footer.newsletter.subtitle")}</p>
        {/* subscribe email */}
        <SubscribeEmail mailchimpUrl="//devitems.us11.list-manage.com/subscribe/post?u=6bbb9b6f5827bd842d9640c82&amp;id=05d85f18ef" />
      </div>
    </div>
  );
};

export default FooterNewsletter;

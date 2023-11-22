import clsx from "clsx";
import SubscribeEmailTwo from "../../components/newsletter/SubscribeEmailTwo";
import { useTranslation } from "react-i18next";

type NewsletterFourProps = {
  spaceTopClass?: string;
  spaceBottomClass?: string;
  subscribeBtnClass?: string;
  bgColorClass?: string;
};

const NewsletterFour: React.FC<NewsletterFourProps> = ({
  spaceTopClass,
  spaceBottomClass,
  subscribeBtnClass,
  bgColorClass,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={clsx(
        "subscribe-area-3",
        spaceTopClass,
        spaceBottomClass,
        bgColorClass,
        "bg-oldlace"
      )}
    >
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-5 col-lg-7 col-md-10 ms-auto me-auto">
            <div className="subscribe-style-3 subscribe-style-3--title-style2 text-center">
              <h2>{t(`newsletter.title`)}</h2>
              <p>{t(`newsletter.subtitle`)}</p>
              {/* subscription form */}
              <SubscribeEmailTwo
                mailchimpUrl="//devitems.us11.list-manage.com/subscribe/post?u=6bbb9b6f5827bd842d9640c82&amp;id=05d85f18ef"
                spaceTopClass="mt-35"
                subscribeBtnClass={subscribeBtnClass}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterFour;

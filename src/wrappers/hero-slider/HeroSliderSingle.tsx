import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

type HeroSliderTwentyEightSingleProps = {
  data: {
    image: string;
    title: string;
    subtitle: string;
    url: string;
  };
};

const HeroSliderTwentyEightSingle: React.FC<
  HeroSliderTwentyEightSingleProps
> = ({ data }) => {
  const { t } = useTranslation();

  return (
    <div
      className="single-slider-2 slider-height-2 d-flex align-items-center bg-img"
      style={{ backgroundImage: `url(${data.image})` }}
    >
      <div className="container">
        <div className="row">
          <div className="col-xl-6 col-lg-7 col-md-8 col-12">
            <div className="slider-content-red slider-content-2 slider-content-2--white slider-animated-1">
              <h3 className="animated no-style">{data.title}</h3>
              <h1
                className="animated"
                dangerouslySetInnerHTML={{ __html: data.subtitle }}
              />
              <div className="slider-btn-red btn-hover">
                <Link className="animated" to={data.url}>
                  {t("home_page.buttons.shop_now")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSliderTwentyEightSingle;

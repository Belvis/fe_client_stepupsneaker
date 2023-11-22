import clsx from "clsx";
import Swiper, { SwiperSlide } from "../../components/swiper";
import BrandLogoOneSingle from "../../components/brand-logo/BrandLogoOneSingle";
import brandLogoData from "../../data/brand-logos/brand-logo-one.json";
import SectionTitleSeven from "../../components/section-title/SectionTitleSeven";
import { useTranslation } from "react-i18next";

interface BrandLogoSliderThreeProps {
  spaceBottomClass?: string;
  spaceTopClass?: string;
}

const settings = {
  loop: true,
  autoplay: true,
  grabCursor: true,
  breakpoints: {
    320: {
      slidesPerView: 2,
    },
    640: {
      slidesPerView: 3,
    },
    768: {
      slidesPerView: 4,
    },
    1024: {
      slidesPerView: 5,
    },
  },
};

const BrandLogoSliderThree: React.FC<BrandLogoSliderThreeProps> = ({
  spaceBottomClass,
  spaceTopClass,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={clsx(
        "brand-logo-area",
        spaceBottomClass,
        spaceTopClass,
        "bg-white"
      )}
    >
      <div className="container">
        <SectionTitleSeven
          titleText={t(`brand_logo.our_clients`)}
          positionClass="text-center"
          spaceClass="mb-50"
          borderClass="no-border"
        />
        <div className="brand-logo-active">
          {brandLogoData && (
            <Swiper options={settings}>
              {brandLogoData.map((single, key) => (
                <SwiperSlide key={key}>
                  <BrandLogoOneSingle data={single} spaceBottomClass="mb-30" />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandLogoSliderThree;

import { Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import HeroSlider from "../../wrappers/hero-slider/HeroSlider";
import FeatureIcon from "../../wrappers/feature-icon/FeatureIcon";
import VideoPopup from "../../components/video-popup/VideoPopup";
import ProductSlider from "../../wrappers/product/ProductSlider";
import Banner from "../../wrappers/banner/Banner";
import ProductSliderTwo from "../../wrappers/product/ProductSliderTwo";
import BrandLogoSliderThree from "../../wrappers/brand-logo/BrandLogoSlider";
import NewsletterFour from "../../wrappers/newsletter/NewsletterFour";
import { useDocumentTitle } from "@refinedev/react-router-v6";

export const HomePage: React.FC = () => {
  const { t } = useTranslation();

  const setTitle = useDocumentTitle();

  useEffect(() => {
    setTitle(t("nav.home") + " | SUNS");
  }, [t]);

  return (
    <Fragment>
      {/* hero slider */}
      <HeroSlider />
      {/* feature text */}
      <FeatureIcon spaceBottomClass="pb-100" spaceTopClass="pt-30" />
      {/* video popup */}
      <VideoPopup spaceBottomClass="pb-100" />
      {/* product slider */}
      <ProductSlider />
      {/* banner */}
      <Banner spaceTopClass="pt-100" spaceBottomClass="pb-70" />
      {/* product slider */}
      <ProductSliderTwo />
      {/* brand logo slider */}
      <BrandLogoSliderThree spaceBottomClass="pb-95" spaceTopClass="pt-100" />
      {/* newsletter */}
      <NewsletterFour
        spaceTopClass="pt-100"
        spaceBottomClass="pb-100"
        subscribeBtnClass="hover-red"
        bgColorClass="bg-gray-7"
      />
    </Fragment>
  );
};

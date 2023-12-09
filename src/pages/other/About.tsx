import { Fragment, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import SectionTitleWithText from "../../components/section-title/SectionTitleWithText";
import BannerOne from "../../wrappers/banner/BannerOne";
import TextGridOne from "../../wrappers/text-grid/TextGridOne";
import FunFactOne from "../../wrappers/fun-fact/FunFactOne";
import TeamMemberOne from "../../wrappers/team-member/TeamMemberOne";
import BrandLogoSliderOne from "../../wrappers/brand-logo/BrandLogoSliderOne";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import { useTranslation } from "react-i18next";

const About = () => {
  let { pathname } = useLocation();
  const { t } = useTranslation();

  const setTitle = useDocumentTitle();

  useEffect(() => {
    setTitle(t("nav.about_us") + " | SUNS");
  }, [t]);

  return (
    <Fragment>
      <Breadcrumb
        pages={[
          { label: "home", path: "/" },
          { label: "about_us", path: pathname },
        ]}
      />

      {/* section title with text */}
      <SectionTitleWithText
        spaceTopClass="pt-100 bg-white"
        spaceBottomClass="pb-95"
      />

      {/* banner */}
      <BannerOne spaceBottomClass="pb-70 bg-white" />

      {/* text grid */}
      <TextGridOne spaceBottomClass="pb-70 bg-white" />

      {/* fun fact */}
      <FunFactOne
        spaceTopClass="pt-100"
        spaceBottomClass="pb-70"
        bgClass="bg-gray-3"
      />

      {/* team member */}
      <TeamMemberOne spaceTopClass="pt-95 bg-white" spaceBottomClass="pb-70" />

      {/* brand logo slider */}
      <BrandLogoSliderOne
        spaceTopClass="pt-95 bg-white"
        spaceBottomClass="pb-70"
      />
    </Fragment>
  );
};

export default About;

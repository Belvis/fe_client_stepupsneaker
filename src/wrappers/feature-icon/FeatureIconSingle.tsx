import React from "react";
import clsx from "clsx";
import { IFeatureIconData } from "../../interfaces";
import { useTranslation } from "react-i18next";

interface FeatureIconSingleProps {
  data: IFeatureIconData;
  spaceBottomClass?: string;
  textAlignClass?: string;
}

const FeatureIconSingle: React.FC<FeatureIconSingleProps> = ({
  data,
  spaceBottomClass,
  textAlignClass,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={clsx(
        "support-wrap-5 support-shape",
        spaceBottomClass,
        textAlignClass
      )}
    >
      <div className="support-content-5">
        <h5>{t(`feature_icon.${data.id}.${data.title}`)}</h5>
        <p>{t(`feature_icon.${data.id}.${data.subtitle}`)}</p>
      </div>
    </div>
  );
};

export default FeatureIconSingle;

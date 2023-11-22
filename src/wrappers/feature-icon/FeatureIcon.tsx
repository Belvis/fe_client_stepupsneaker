import React from "react";
import clsx from "clsx";
import featureIconData from "../../data/feature-icons/feature-icon-six.json";
import { IFeatureIconData } from "../../interfaces";
import FeatureIconSingle from "./FeatureIconSingle";

type FeatureIconProps = {
  spaceTopClass?: string;
  spaceBottomClass?: string;
};

const FeatureIcon: React.FC<FeatureIconProps> = ({
  spaceTopClass,
  spaceBottomClass,
}) => {
  return (
    <div
      className={clsx(
        "support-area",
        spaceTopClass,
        spaceBottomClass,
        "bg-white"
      )}
    >
      <div className="container">
        <div className="border-bottom">
          <div className="row feature-icon-two-wrap">
            {featureIconData?.map(
              (single: IFeatureIconData, key: React.Key | null | undefined) => (
                <div className="col-md-4" key={key}>
                  <FeatureIconSingle
                    data={single}
                    spaceBottomClass="mb-30"
                    textAlignClass="text-center"
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureIcon;

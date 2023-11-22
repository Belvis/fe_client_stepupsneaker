import React from "react";
import clsx from "clsx";

type SectionTitleProps = {
  titleText: string;
  subtitleText?: string;
  positionClass?: string;
  spaceClass?: string;
  borderClass?: string;
};

const SectionTitleSeven: React.FC<SectionTitleProps> = ({
  titleText,
  subtitleText,
  positionClass,
  spaceClass,
  borderClass,
}) => {
  return (
    <div
      className={clsx(
        "section-title-8",
        positionClass,
        spaceClass,
        borderClass
      )}
    >
      <h2>{titleText}</h2>
      <p>{subtitleText}</p>
    </div>
  );
};

export default SectionTitleSeven;

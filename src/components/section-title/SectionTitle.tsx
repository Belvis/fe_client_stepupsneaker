import clsx from "clsx";

interface SectionTitleProps {
  titleText: string;
  subtitleText?: string;
  subtitleColorClass?: string;
  positionClass?: string;
  spaceClass?: string;
  borderClass?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  titleText,
  subtitleText,
  subtitleColorClass,
  positionClass,
  spaceClass,
  borderClass,
}) => {
  return (
    <div
      className={clsx("section-title", positionClass, spaceClass, borderClass)}
    >
      <h2>{titleText}</h2>
      {subtitleText && (
        <p className={clsx(subtitleColorClass)}>{subtitleText}</p>
      )}
    </div>
  );
};

export default SectionTitle;

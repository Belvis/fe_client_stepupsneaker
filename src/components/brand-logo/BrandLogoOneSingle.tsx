import clsx from "clsx";

type BrandLogoOneSingleProps = {
  data: {
    svg: string;
    // Add any other properties from your data object
  };
  spaceBottomClass?: string;
};

const BrandLogoOneSingle: React.FC<BrandLogoOneSingleProps> = ({
  data,
  spaceBottomClass,
}) => {
  return (
    <div className={clsx("single-brand-logo", spaceBottomClass)}>
      <img src={data.svg} alt="" />
    </div>
  );
};

export default BrandLogoOneSingle;

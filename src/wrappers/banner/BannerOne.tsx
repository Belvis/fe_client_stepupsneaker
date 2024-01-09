import clsx from "clsx";
import bannerData from "../../data/banner/banner-one.json";
import BannerOneSingle from "../../components/banner/BannerOneSingle.js";

type BannerOneProps = {
  spaceBottomClass: string;
  spaceTopClass?: string;
};

const BannerOne: React.FC<BannerOneProps> = ({
  spaceTopClass,
  spaceBottomClass,
}) => {
  return (
    <div className={clsx("banner-area", spaceTopClass, spaceBottomClass)}>
      <div className="container">
        <div className="row">
          {bannerData?.map((single, key) => (
            <div className="col-lg-4 col-md-4" key={key}>
              <BannerOneSingle data={single} spaceBottomClass="mb-30" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerOne;

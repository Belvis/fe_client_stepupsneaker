import clsx from "clsx";
import { Link } from "react-router-dom";

type BannerProps = {
  spaceTopClass?: string;
  spaceBottomClass?: string;
};

const Banner: React.FC<BannerProps> = ({ spaceTopClass, spaceBottomClass }) => {
  return (
    <div
      className={clsx(
        "banner-area",
        spaceTopClass,
        spaceBottomClass,
        "bg-white"
      )}
    >
      <div className="container">
        <div className="row">
          <div className="col-md-8">
            <div className="single-banner mb-30">
              <Link to={"/shop"}>
                <img
                  src={"/images/banner/banner-04.jpg"}
                  alt=""
                  className="img-fluid"
                />
              </Link>
            </div>
          </div>
          <div className="col-md-4">
            <div className="single-banner mb-30">
              <Link to={"/shop"}>
                <img
                  src={"/images/banner/banner-05.jpg"}
                  alt=""
                  className="img-fluid"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;

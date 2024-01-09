import clsx from "clsx";
import { Link } from "react-router-dom";

type BannerOneSingleProps = {
  data: {
    id: number;
    image: string;
    title: string;
    subtitle: string;
    price: string;
    link: string;
  };
  spaceBottomClass: string;
};

const BannerOneSingle: React.FC<BannerOneSingleProps> = ({
  data,
  spaceBottomClass,
}) => {
  return (
    <div className={clsx("single-banner", spaceBottomClass)}>
      <Link to={data.link}>
        <img src={data.image} alt="" />
      </Link>
      <div className="banner-content">
        <h3>{data.title}</h3>
        <h4>
          {data.subtitle} <span>{data.price}</span>
        </h4>
        <Link to={data.link}>
          <i className="fa fa-long-arrow-right" />
        </Link>
      </div>
    </div>
  );
};

export default BannerOneSingle;

import { useState } from "react";
import clsx from "clsx";
import CountUp from "react-countup";
import VisibilitySensor from "react-visibility-sensor";

type FunFactOneSingleProps = {
  data: {
    id: string;
    iconClass: string;
    countNum: number;
    title: string;
  };
  spaceBottomClass: string;
  textAlignClass: string;
};

const FunFactOneSingle: React.FC<FunFactOneSingleProps> = ({
  data,
  spaceBottomClass,
  textAlignClass,
}) => {
  const [didViewCountUp, setDidViewCountUp] = useState(false);

  const onVisibilityChange = (isVisible: boolean) => {
    if (isVisible) {
      setDidViewCountUp(true);
    }
  };
  return (
    <div className={clsx("single-count", textAlignClass, spaceBottomClass)}>
      <div className="count-icon">
        <i className={data.iconClass} />
      </div>
      <h2 className="count">
        <VisibilitySensor
          onChange={onVisibilityChange}
          offset={{ top: 10 }}
          delayedCall
        >
          <CountUp end={didViewCountUp ? data.countNum : 0} />
        </VisibilitySensor>
      </h2>
      <span>{data.title}</span>
    </div>
  );
};

export default FunFactOneSingle;

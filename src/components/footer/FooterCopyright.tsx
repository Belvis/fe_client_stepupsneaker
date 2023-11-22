import PropTypes from "prop-types";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { AppIcon } from "../app-icon";

type FooterCopyrightProps = {
  footerLogo?: string;
  spaceBottomClass?: string;
  colorClass?: string;
};

const FooterCopyright: React.FC<FooterCopyrightProps> = ({
  footerLogo,
  spaceBottomClass,
  colorClass,
}) => {
  return (
    <div className={clsx("copyright", spaceBottomClass, colorClass)}>
      <div className="footer-logo">
        <Link to={"/"}>
          <AppIcon width={100} />
        </Link>
      </div>
      <p>
        &copy; {new Date().getFullYear()}{" "}
        <a
          href="https://hasthemes.com"
          rel="noopener noreferrer"
          target="_blank"
        >
          Sunsneaker
        </a>
        .<br /> All Rights Reserved
      </p>
    </div>
  );
};

export default FooterCopyright;

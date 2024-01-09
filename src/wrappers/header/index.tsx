import { useEffect, useState } from "react";
import clsx from "clsx";
import {
  AppIcon,
  HeaderTop,
  IconGroup,
  MobileMenu,
  NavMenu,
} from "../../components";
import { useGetLocale } from "@refinedev/core";
import dayjs from "dayjs";

type HeaderProps = {
  layout?: string;
  top?: string;
  borderStyle?: string;
  headerPaddingClass?: string;
  headerPositionClass?: string;
  headerBgClass?: string;
};

export const Header: React.FC<HeaderProps> = ({
  layout,
  top,
  borderStyle,
  headerPaddingClass,
  headerPositionClass,
  headerBgClass,
}) => {
  const [scroll, setScroll] = useState(0);
  const [headerTop, setHeaderTop] = useState(0);

  const locale = useGetLocale();
  const currentLocale = locale();
  dayjs.locale(currentLocale);

  useEffect(() => {
    const header = document.querySelector(".sticky-bar") as HTMLElement | null;
    setHeaderTop(header ? header.offsetTop : 0);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    setScroll(window.scrollY);
  };

  return (
    <header
      className={clsx(
        "header-area clearfix",
        headerBgClass,
        headerPositionClass
      )}
    >
      <div
        className={clsx(
          "header-top-area",
          headerPaddingClass,
          top === "visible" ? "d-none d-lg-block" : "d-none",
          borderStyle === "fluid-border" && "border-none"
        )}
      >
        <div className={layout === "container-fluid" ? layout : "container"}>
          {/* header top */}
          <HeaderTop borderStyle={borderStyle} />
        </div>
      </div>

      <div
        className={clsx(
          headerPaddingClass,
          "sticky-bar header-res-padding clearfix",
          scroll > headerTop && "stick"
        )}
      >
        <div className={layout === "container-fluid" ? layout : "container"}>
          <div className="row">
            <div
              className="col-xl-2 col-lg-2 col-md-6 col-4"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* header logo */}
              <AppIcon width={200} height={60} />
            </div>
            <div className="col-xl-8 col-lg-8 d-none d-lg-block">
              {/* Nav menu */}
              <NavMenu />
            </div>
            <div className="col-xl-2 col-lg-2 col-md-6 col-8">
              {/* Icon group */}
              <IconGroup />
            </div>
          </div>
        </div>
        {/* mobile menu */}
        <MobileMenu />
      </div>
    </header>
  );
};

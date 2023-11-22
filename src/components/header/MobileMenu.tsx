import React, { useEffect } from "react";
import MobileMenuSearch from "./sub-components/MobileSearch";
import MobileNavMenu from "./sub-components/MobileNavMenu";
import MobileLangCurChange from "./sub-components/MobileLangCurrChange";
import MobileWidgets from "./sub-components/MobileWidgets";

export const MobileMenu: React.FC = () => {
  useEffect(() => {
    const offCanvasNav = document.querySelector<HTMLDivElement>(
      "#offcanvas-navigation"
    );
    const offCanvasNavSubMenu = offCanvasNav?.querySelectorAll(".sub-menu");
    const anchorLinks = offCanvasNav?.querySelectorAll("a");

    if (offCanvasNavSubMenu && anchorLinks) {
      for (let i = 0; i < offCanvasNavSubMenu.length; i++) {
        offCanvasNavSubMenu[i].insertAdjacentHTML(
          "beforebegin",
          "<span class='menu-expand'><i></i></span>"
        );
      }

      const menuExpand = offCanvasNav?.querySelectorAll(".menu-expand");
      const numMenuExpand = menuExpand?.length;

      if (menuExpand && numMenuExpand) {
        for (let i = 0; i < numMenuExpand; i++) {
          menuExpand[i].addEventListener("click", (e) => {
            sideMenuExpand(e as any);
          });
        }
      }

      if (anchorLinks) {
        for (let i = 0; i < anchorLinks.length; i++) {
          anchorLinks[i].addEventListener("click", () => {
            closeMobileMenu();
          });
        }
      }
    }
  }, []);

  const sideMenuExpand = (e: React.MouseEvent<HTMLSpanElement>) => {
    const target = e.currentTarget.parentElement;
    if (target) {
      target.classList.toggle("active");
    }
  };

  const closeMobileMenu = () => {
    const offcanvasMobileMenu = document.querySelector<HTMLDivElement>(
      "#offcanvas-mobile-menu"
    );
    if (offcanvasMobileMenu) {
      offcanvasMobileMenu.classList.remove("active");
    }
  };

  return (
    <div className="offcanvas-mobile-menu" id="offcanvas-mobile-menu">
      <button
        className="offcanvas-menu-close"
        id="mobile-menu-close-trigger"
        onClick={() => closeMobileMenu()}
      >
        <i className="pe-7s-close"></i>
      </button>
      <div className="offcanvas-wrapper">
        <div className="offcanvas-inner-content">
          {/* mobile search */}
          <MobileMenuSearch />

          {/* mobile nav menu */}
          <MobileNavMenu />

          {/* mobile language and currency */}
          <MobileLangCurChange />

          {/* mobile widgets */}
          <MobileWidgets />
        </div>
      </div>
    </div>
  );
};

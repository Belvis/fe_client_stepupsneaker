import { useTranslate } from "@refinedev/core";

const MobileSearch = () => {
  const t = useTranslate();

  return (
    <div className="offcanvas-mobile-search-area">
      <form action="#">
        <input type="search" placeholder={`${t("common.search")}...`} />
        <button type="submit">
          <i className="fa fa-search" />
        </button>
      </form>
    </div>
  );
};

export default MobileSearch;

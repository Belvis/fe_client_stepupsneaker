import { useTranslate } from "@refinedev/core";
import { debounce } from "lodash";

interface ShopSearchProps {
  updateFilterParams: (field: string, value: string) => void;
}

const ShopSearch: React.FC<ShopSearchProps> = ({ updateFilterParams }) => {
  const t = useTranslate();
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  const handleChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      updateFilterParams("q", event.target.value);
    },
    300
  );

  return (
    <div className="sidebar-widget">
      <h4 className="pro-sidebar-title">{t("common.search")}</h4>
      <div className="pro-sidebar-search mb-50 mt-25">
        <form className="pro-sidebar-search-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="q"
            placeholder={t("common.search_placeholder")}
            onChange={handleChange}
          />
          <button type="submit">
            <i className="pe-7s-search" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShopSearch;

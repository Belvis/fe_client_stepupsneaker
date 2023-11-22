import clsx from "clsx";
import SectionTitleSeven from "../../components/section-title/SectionTitleSeven";
import ProductGrid from "./ProductGrid";
import { useTranslation } from "react-i18next";

type ProductSliderProps = {
  spaceBottomClass?: string;
};

const ProductSlider: React.FC<ProductSliderProps> = ({ spaceBottomClass }) => {
  const { t } = useTranslation();

  return (
    <div className={clsx("related-product-area", spaceBottomClass, "bg-white")}>
      <div className="container">
        <SectionTitleSeven
          titleText={t(`product_slider.new_products.title`)}
          subtitleText={t(`product_slider.new_products.subtitle`)}
          spaceClass="mb-55"
          borderClass="no-border"
          positionClass="text-center"
        />
        <div className="row">
          <ProductGrid limit={6} />
        </div>
      </div>
    </div>
  );
};

export default ProductSlider;

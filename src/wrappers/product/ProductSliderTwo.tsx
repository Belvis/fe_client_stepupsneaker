import clsx from "clsx";
import SectionTitleSeven from "../../components/section-title/SectionTitleSeven";
import ProductGridEight from "./ProductGridTwo";
import { useTranslation } from "react-i18next";

type ProductSliderTwoProps = {
  spaceBottomClass?: string;
  colorClass?: string;
};

const ProductSliderTwo: React.FC<ProductSliderTwoProps> = ({
  spaceBottomClass,
  colorClass,
}) => {
  const { t } = useTranslation();

  return (
    <div className={clsx("related-product-area", spaceBottomClass, "bg-white")}>
      <div className="container">
        <SectionTitleSeven
          titleText={t(`product_slider.best_products.title`)}
          subtitleText={t(`product_slider.best_products.subtitle`)}
          positionClass="text-center"
          spaceClass="mb-55"
          borderClass="no-border"
        />
        <ProductGridEight limit={6} colorClass={colorClass} />
      </div>
    </div>
  );
};

export default ProductSliderTwo;

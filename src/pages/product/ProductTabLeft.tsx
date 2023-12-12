import { Fragment, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import RelatedProductSlider from "../../wrappers/product/RelatedProductSlider";
import ProductDescriptionTab from "../../wrappers/product/ProductDescriptionTab";
import ProductImageDescription from "../../wrappers/product/ProductImageDescription";
import { HttpError, useOne } from "@refinedev/core";
import { IProductResponse } from "../../interfaces";
import { mapProductsToClients } from "../../helpers/product";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@refinedev/react-router-v6";

const ProductTabLeft = () => {
  const { t } = useTranslation();

  const setTitle = useDocumentTitle();

  useEffect(() => {
    setTitle(t("nav.product") + " | SUNS");
  }, [t]);

  let { pathname } = useLocation();
  let { id } = useParams();
  const { data, isLoading, isError } = useOne<IProductResponse, HttpError>({
    resource: "products",
    id: id,
  });
  const products = data?.data ? mapProductsToClients([data?.data]) : [];
  const product = products[0];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Something went wrong!</div>;
  }

  return (
    <Fragment>
      <Breadcrumb
        pages={[
          { label: "home", path: "/" },
          { label: "product", path: pathname },
        ]}
      />

      {/* product description with image */}
      <ProductImageDescription
        spaceTopClass="pt-100"
        spaceBottomClass="pb-100"
        product={product}
        galleryType="leftThumb"
      />

      {/* product description tab */}
      <ProductDescriptionTab
        spaceBottomClass="pb-90"
        productFullDesc={product.description}
      />

      {/* related product slider */}
      <RelatedProductSlider
        spaceBottomClass="pb-95"
        style={"6d61449e-0ff9-4ab0-80bd-7ee6aa3335e9"}
      />
    </Fragment>
  );
};

export default ProductTabLeft;

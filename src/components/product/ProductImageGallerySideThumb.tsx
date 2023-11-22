import { Fragment, useState } from "react";
import clsx from "clsx";
import { EffectFade, Thumbs } from "swiper";
import AnotherLightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Swiper, { SwiperSlide } from "../swiper";
import { IProductClient, IVariation } from "../../interfaces";
import { Badge } from "antd";
import { useTranslation } from "react-i18next";

interface ProductImageGalleryLeftThumbProps {
  product: IProductClient;
  thumbPosition?: string;
  selectedVariant: IVariation;
}

const ProductImageGalleryLeftThumb: React.FC<
  ProductImageGalleryLeftThumbProps
> = ({ product, thumbPosition, selectedVariant }) => {
  const { t } = useTranslation();

  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [index, setIndex] = useState(-1);
  const slides = product?.image.map((img, i) => ({
    src: img,
    key: i,
  }));

  // swiper slider settings
  const gallerySwiperParams = {
    spaceBetween: 10,
    loop: true,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    thumbs: {
      swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
    },
    modules: [EffectFade, Thumbs],
  };

  const thumbnailSwiperParams = {
    onSwiper: setThumbsSwiper,
    spaceBetween: 10,
    slidesPerView: 4,
    touchRatio: 0.2,
    loop: true,
    slideToClickedSlide: true,
    direction: "vertical",
    breakpoints: {
      320: {
        slidesPerView: 4,
        direction: "horizontal",
      },
      640: {
        slidesPerView: 4,
        direction: "horizontal",
      },
      768: {
        slidesPerView: 4,
        direction: "horizontal",
      },
      992: {
        slidesPerView: 4,
        direction: "horizontal",
      },
      1200: {
        slidesPerView: 4,
        direction: "vertical",
      },
    },
  };

  return (
    <Fragment>
      <div className="row row-5 test">
        <div
          className={clsx(
            thumbPosition && thumbPosition === "left"
              ? "col-xl-10 order-1 order-xl-2"
              : "col-xl-10"
          )}
        >
          <Badge.Ribbon
            text={`${t("products.sale")} -${product.discount ?? 0}%`}
            color="red"
            placement="start"
            style={{
              zIndex: 2,
              display: product.discount ? "" : "none",
            }}
          >
            <Badge.Ribbon
              text={t("products.new")}
              placement="start"
              color="green"
              style={{
                zIndex: 2,
                marginTop: product.discount ? "40px" : "",
                display: product.new ? "" : "none",
              }}
            >
              <div className="product-large-image-wrapper">
                {selectedVariant && selectedVariant.image.length > 0 ? (
                  <Swiper options={gallerySwiperParams}>
                    {selectedVariant?.image.map((single, key) => (
                      <SwiperSlide key={key}>
                        <button
                          className="lightgallery-button"
                          onClick={() => setIndex(key)}
                        >
                          <i className="pe-7s-expand1"></i>
                        </button>
                        <div className="single-image">
                          <img
                            src={single}
                            className="img-fluid"
                            alt=""
                            style={{ maxHeight: "450px" }}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                    <AnotherLightbox
                      open={index >= 0}
                      index={index}
                      close={() => setIndex(-1)}
                      slides={slides}
                      plugins={[Thumbnails, Zoom, Fullscreen]}
                    />
                  </Swiper>
                ) : (
                  ""
                )}
              </div>
            </Badge.Ribbon>
          </Badge.Ribbon>
        </div>
        <div
          className={clsx(
            thumbPosition && thumbPosition === "left"
              ? "col-xl-2 order-2 order-xl-1"
              : "col-xl-2"
          )}
        >
          <div className="product-small-image-wrapper product-small-image-wrapper--side-thumb">
            {selectedVariant && selectedVariant.image.length > 0 ? (
              <Swiper options={thumbnailSwiperParams as any}>
                {selectedVariant?.image.map((single, i) => (
                  <SwiperSlide key={i}>
                    <div className="single-image">
                      <img src={single} className="img-fluid" alt="" />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ProductImageGalleryLeftThumb;

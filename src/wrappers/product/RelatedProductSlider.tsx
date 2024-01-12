import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import Swiper, { SwiperSlide } from "../../components/swiper";
import SectionTitle from "../../components/section-title/SectionTitle";
import ProductGridSingle from "../../components/product/ProductGridSingle";
import { AppDispatch, RootState } from "../../redux/store";
import { HttpError, useIsAuthenticated, useList } from "@refinedev/core";
import { IProductResponse } from "../../interfaces";
import { mapProductsToClients } from "../../helpers/product";
import { Spin } from "antd";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { fetchCart } from "../../redux/slices/cart-slice";

interface RelatedProductSliderProps {
  spaceBottomClass: string;
  style: string;
}

const settings: {
  loop: boolean;
  slidesPerView: number;
  grabCursor: boolean;
  spaceBetween: number;
  breakpoints: {
    320: {
      slidesPerView: number;
    };
    576: {
      slidesPerView: number;
    };
    768: {
      slidesPerView: number;
    };
    1024: {
      slidesPerView: number;
    };
  };
} = {
  loop: false,
  slidesPerView: 4,
  grabCursor: true,
  spaceBetween: 30,
  breakpoints: {
    320: {
      slidesPerView: 1,
    },
    576: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 3,
    },
    1024: {
      slidesPerView: 4,
    },
  },
};

const RelatedProductSlider: React.FC<RelatedProductSliderProps> = ({
  spaceBottomClass,
  style,
}) => {
  const { t } = useTranslation();

  const currency = useSelector((state: RootState) => state.currency);
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const { wishlistItems } = useSelector((state: RootState) => state.wishlist);
  const { compareItems } = useSelector((state: RootState) => state.compare);
  const { data, isLoading, isError } = useList<IProductResponse, HttpError>({
    resource: "products",
    filters: [
      {
        field: "style",
        operator: "eq",
        value: style,
      },
    ],
    pagination: {
      pageSize: 6,
    },
  });

  const prods = data?.data ? mapProductsToClients(data?.data) : [];

  if (isError) {
    return <p>Error loading products</p>;
  }

  if (!prods?.length && !isLoading) {
    return <p>No products found</p>;
  }

  return (
    <div className={clsx("related-product-area", spaceBottomClass, "bg-white")}>
      <div className="container">
        <SectionTitle
          titleText={t(`products.related_products`)}
          positionClass="text-center"
          spaceClass="mb-50"
        />
        {prods?.length ? (
          <Spin spinning={isLoading} tip="Loading...">
            <Swiper options={settings as any}>
              {prods.map((product) => (
                <SwiperSlide key={product.id}>
                  <ProductGridSingle
                    product={product}
                    currency={currency}
                    cartItem={cartItems.find(
                      (cartItem) => cartItem.id === product.id
                    )}
                    wishlistItem={wishlistItems.find(
                      (wishlistItem) => wishlistItem.id === product.id
                    )}
                    compareItem={compareItems.find(
                      (compareItem) => compareItem.id === product.id
                    )}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </Spin>
        ) : null}
      </div>
    </div>
  );
};

export default RelatedProductSlider;

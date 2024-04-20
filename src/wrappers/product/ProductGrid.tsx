import { HttpError, useList } from "@refinedev/core";
import { Spin } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import ProductGridSingle from "../../components/product/ProductGridSingle";
import Swiper, { SwiperSlide } from "../../components/swiper";
import { mapProductsToClients } from "../../helpers/product";
import { IProductResponse } from "../../interfaces";
import { RootState } from "../../redux/store";

type ProductGridProps = {
  spaceBottomClass?: string;
  colorClass?: string;
  limit: number;
};

const settings: {
  modules?: any[];
  autoplay?: boolean;
  navigation?: boolean;
  pagination?: boolean;
  loop: boolean;
  slidesPerView: number;
  spaceBetween: number;
  grabCursor: boolean;
  breakpoints: {
    320: { slidesPerView: number };
    576: { slidesPerView: number };
    768: { slidesPerView: number };
    1024: { slidesPerView: number };
  };
} = {
  loop: false,
  slidesPerView: 4,
  spaceBetween: 30,
  grabCursor: true,
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

const ProductGrid: React.FC<ProductGridProps> = ({
  spaceBottomClass,
  colorClass,
  limit,
}) => {
  const currency = useSelector((state: RootState) => state.currency);
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const { wishlistItems } = useSelector((state: RootState) => state.wishlist);
  const { compareItems } = useSelector((state: RootState) => state.compare);

  const { data, isLoading, isError } = useList<IProductResponse, HttpError>({
    resource: "products",
    pagination: {
      pageSize: limit,
    },
    sorters: [{ field: "updatedAt", order: "desc" }],
  });
  const prods = data?.data ? mapProductsToClients(data?.data) : [];

  if (isError) {
    return <p>Error loading products</p>;
  }

  if (!prods?.length && !isLoading) {
    return <p>No products found</p>;
  }

  return (
    <Spin spinning={isLoading} tip="Loading...">
      <Swiper options={settings}>
        {prods.map((product) => {
          return (
            <SwiperSlide key={product.id}>
              <ProductGridSingle
                spaceBottomClass={spaceBottomClass}
                colorClass={colorClass}
                product={product}
                currency={currency}
                cartItem={cartItems?.find(
                  (cartItem) => cartItem.id === product.id
                )}
                wishlistItem={wishlistItems?.find(
                  (wishlistItem) => wishlistItem.id === product.id
                )}
                compareItem={compareItems?.find(
                  (compareItem) => compareItem.id === product.id
                )}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Spin>
  );
};

export default ProductGrid;

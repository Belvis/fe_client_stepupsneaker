import React, { FC } from "react";
import { useSelector } from "react-redux";
import Swiper, { SwiperSlide } from "../../components/swiper";
import ProductGridSingleTwo from "../../components/product/ProductGridSingleTwo";
import { RootState } from "../../redux/store";
import { HttpError, useList } from "@refinedev/core";
import { IProductResponse } from "../../interfaces";
import { mapProductsToClients } from "../../helpers/product";
import { Spin } from "antd";

type ProductGridTwoProps = {
  sliderClassName?: string;
  spaceBottomClass?: string;
  colorClass?: string;
  limit?: number;
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
    640: { slidesPerView: number };
    1200: { slidesPerView: number };
  };
} = {
  loop: false,
  slidesPerView: 1,
  spaceBetween: 30,
  grabCursor: true,
  breakpoints: {
    320: {
      slidesPerView: 1,
    },
    640: {
      slidesPerView: 2,
    },
    1200: {
      slidesPerView: 3,
    },
  },
};

const ProductGridTwo: FC<ProductGridTwoProps> = ({
  limit,
  spaceBottomClass,
  colorClass,
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
        {prods.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductGridSingleTwo
              spaceBottomClass={spaceBottomClass}
              colorClass={colorClass}
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
  );
};

export default ProductGridTwo;

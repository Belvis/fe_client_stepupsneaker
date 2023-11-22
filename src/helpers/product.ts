import {
  ICartItem,
  IColorResponse,
  IProductClient,
  IProductDetailResponse,
  IProductResponse,
  IPromotionProductDetailResponse,
  IPromotionResponse,
  ISizeClient,
  IVariation,
} from "../interfaces";

type IDiscountInfo = {
  value: number;
  endDate: number;
};

const mapSizeToSizeClient = (detail: IProductDetailResponse): ISizeClient => {
  const discountInfo = getDiscountInfo(detail.promotionProductDetails);

  return {
    id: detail.size?.id || "",
    name: detail.size?.name || "",
    stock: detail.quantity || 0,
    price: detail.price,
    discount: discountInfo?.value ?? 0,
    offerEnd: discountInfo?.endDate ?? 0,
    saleCount: 0,
    productDetailId: detail.id,
  };
};

const mapProductResponseToClient = (
  productResponse: IProductResponse
): IProductClient => {
  const variations: IVariation[] = [];
  const images: string[] = [productResponse.image];
  let minPrice = Number.MAX_SAFE_INTEGER;
  let maxPrice = Number.MIN_SAFE_INTEGER;
  let discountInfo = {
    value: 0,
    endDate: 0,
  } as IDiscountInfo;
  const thresholdInMilliseconds = 7 * 24 * 60 * 60 * 1000;
  const currentTime = new Date().getTime();
  const isNew =
    currentTime - productResponse.createdAt < thresholdInMilliseconds;

  productResponse.productDetails.forEach((productDetail) => {
    images.push(productDetail.image);
    const existingVariation = variations.find(
      (v) => v.color.id === productDetail.color.id
    );
    if (existingVariation) {
      existingVariation.size.push(mapSizeToSizeClient(productDetail));
      existingVariation.image.push(productDetail.image);

      minPrice = Math.min(minPrice, productDetail.price);
      maxPrice = Math.max(maxPrice, productDetail.price);
    } else {
      const newVariation: IVariation = {
        color: productDetail.color,
        image: [productDetail.image],
        size: [mapSizeToSizeClient(productDetail)],
      };
      variations.push(newVariation);

      minPrice = Math.min(minPrice, productDetail.price);
      maxPrice = Math.max(maxPrice, productDetail.price);
    }

    const currentDiscountInfo = getDiscountInfo(
      productDetail.promotionProductDetails
    );

    if (currentDiscountInfo) {
      if (!discountInfo || currentDiscountInfo.value > discountInfo.value) {
        discountInfo = currentDiscountInfo;
      }
    }
  });

  if (productResponse.productDetails.length === 0) {
    minPrice = 0;
    maxPrice = 0;
  }

  return {
    id: productResponse.id,
    code: productResponse.code,
    name: productResponse.name,
    price: {
      min: minPrice,
      max: maxPrice,
    },
    discount: discountInfo.value,
    saleCount: productResponse.saleCount,
    offerEnd: discountInfo.endDate,
    new: isNew,
    variation: variations,
    image: images,
    description: productResponse.description,
  };
};

const mapProductsToClients = (
  products: IProductResponse[]
): IProductClient[] => {
  return products.map(mapProductResponseToClient).map((product) => {
    product.image.sort();

    product.variation.sort((a, b) => a.color.name.localeCompare(b.color.name));

    product.variation.forEach((variation) => {
      variation.size.sort((a, b) => a.name.localeCompare(b.name));
    });

    product.variation.forEach((variation) => {
      variation.image.sort();
    });

    return product;
  });
};

// get product cart quantity
const getProductCartQuantity = (
  cartItems: ICartItem[],
  product: IProductClient,
  color: IColorResponse,
  size: ISizeClient
): number => {
  const productInCart = cartItems.find(
    (single: any) =>
      single.id === product.id &&
      (single.selectedProductColor
        ? single.selectedProductColor === color
        : true) &&
      (single.selectedProductSize ? single.selectedProductSize === size : true)
  );

  if (cartItems.length >= 1 && productInCart) {
    if (product.variation) {
      return (
        cartItems.find(
          (single: any) =>
            single.id === product.id &&
            single.selectedProductColor === color &&
            single.selectedProductSize === size
        )?.quantity || 0
      );
    } else {
      return (
        cartItems.find((single: any) => product.id === single.id)?.quantity || 0
      );
    }
  } else {
    return 0;
  }
};

export const getDiscountInfo = (
  promotionProductDetails: IPromotionProductDetailResponse[]
): IDiscountInfo | null => {
  if (promotionProductDetails.length === 0) {
    return null;
  }

  const activePromotions = promotionProductDetails
    .map((detail) => detail.promotion)
    .filter((promotion) => promotion.status === "ACTIVE");

  if (activePromotions.length === 0) {
    return null;
  }

  const maxPromotion = activePromotions.reduce((max, promotion) => {
    return promotion.value > max.value ? promotion : max;
  });

  const discountInfo: IDiscountInfo = {
    value: maxPromotion.value,
    endDate: maxPromotion.endDate,
  };

  return discountInfo;
};

export const getDiscountPrice = (price: number, discount: number) => {
  return discount && discount > 0 ? price - price * (discount / 100) : null;
};

export const cartItemStock = (size: ISizeClient | undefined) => {
  return size?.stock ?? 0;
};

export const setActiveSort = (
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>
) => {
  const filterButtons = document.querySelectorAll(
    ".sidebar-widget-list-left button, .sidebar-widget-tag button, .product-filter button"
  );
  filterButtons.forEach((item) => {
    item.classList.remove("active");
  });
  e.currentTarget.classList.add("active");
};

export const setActiveLayout = (
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>
) => {
  const gridSwitchBtn = document.querySelectorAll(".shop-tab button");
  gridSwitchBtn.forEach((item) => {
    item.classList.remove("active");
  });
  e.currentTarget.classList.add("active");
};

export { mapProductsToClients, getProductCartQuantity };

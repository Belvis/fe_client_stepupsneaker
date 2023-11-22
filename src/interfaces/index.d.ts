export interface IFeatureIconData {
  id: number;
  title: string;
  subtitle: string;
}
export type ProductStatus = "ACTIVE" | "IN_ACTIVE";
export type VoucherStatus = "ACTIVE" | "IN_ACTIVE" | "EXPIRED";

// Response

export interface IProductResponse {
  id: string;
  name: string;
  code: string;
  description: string;
  image: string;
  productDetails: IProductDetailResponse[];
  saleCount: number;
  createdAt;
}
export interface IProductDetailResponse {
  id: string;
  tradeMark: ITradeMark;
  style: IStyle;
  size: ISize;
  product: IProductResponse;
  material: IMaterial;
  color: IColorResponse;
  brand: IBrandResponse;
  sole: ISole;
  image: string;
  price: number;
  quantity: number;
  promotionProductDetails: IPromotionProductDetailResponse[];
}
export interface IPromotionProductDetailResponse {
  id: string;
  promotion: IPromotionResponse;
}
export interface IPromotionResponse {
  id: string;
  code: string;
  name: string;
  status: VoucherStatus;
  value: number;
  startDate: number;
  endDate: number;
}
// Entities
export interface IColorResponse {
  id: string;
  code: string;
  name: string;
}
export interface IBrandResponse {
  id: string;
  name: string;
}

export interface IStyleResponse {
  id: string;
  name: string;
}
export interface IMaterialResponse {
  id: string;
  name: string;
}

export interface ISizeResponse {
  id: string;
  name: string;
}
export interface ITradeMarkResponse {
  id: string;
  name: string;
}

export interface ISoleResponse {
  id: string;
  name: string;
}
export interface IVoucherResponse {
  id: string;
  code: string;
  name: string;
  type: "PERCENTAGE" | "CASH";
  value: number;
  constraint: number;
  quantity: number;
  startDate: number;
  endDate: number;
  image: string;
  status: any;
  customerVoucherList: any;
}
// Request

export interface IAddressRequest {
  phoneNumber: string;
  districtId: number;
  districtName: string;
  provinceId: number;
  provinceName: string;
  wardCode: string;
  wardName: string;
  more: string;
}

// Client

export interface IProductClient {
  id: string;
  code: string;
  name: string;
  price: {
    min: number;
    max: number;
  };
  discount: number;
  saleCount: number;
  offerEnd: number;
  new: boolean;
  variation: IVariation[];
  image: string[];
  description: string;
}
export interface IVariation {
  color: IColorResponse;
  image: string[];
  size: ISizeClient[];
}
export interface ISizeClient {
  id: string;
  name: string;
  stock: number;
  price: number;
  discount: number;
  saleCount: number;
  offerEnd: number;
  productDetailId: string;
}
export interface ICartItem {
  id: string;
  cartItemId: string;
  image: string;
  name: string;
  quantity: number;
  selectedProductColor?: IColorResponse;
  selectedProductSize?: ISizeClient;
}
export interface IOrderRequest {
  voucher: IVoucherResponse;
  shippingMoney: number;
  customer?: string;
  address: IAddressRequest;
  fullName: string;
  phoneNumber: number;
  expectedDeliveryDate: number;
  cartItems: ICartItem[];
  note: string;
  // payments: IPayment[];
}
export interface IOrderResponse {
  voucher: IVoucherResponse;
  shippingMoney: number;
  customer?: string;
  address: any;
  fullName: string;
  phoneNumber: number;
  expectedDeliveryDate: number;
  note: string;
  // payments: IPayment[];
}

// GHN
export interface IProvince {
  ProvinceName: any;
  ProvinceID: number;
}
export interface IDistrict {
  DistrictID: number;
  ProvinceID: number;
  DistrictName: string;
}
export interface IWard {
  DistrictID: number;
  WardName: string;
  WardCode: number;
}

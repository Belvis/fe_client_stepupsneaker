export type TranslateFunction = {
  (key: string, options?: any, defaultMessage?: string | undefined): string;
  (key: string, defaultMessage?: string | undefined): string;
};
export interface IEvent {
  date: number | undefined;
  status: OrderStatus;
  loading?: boolean;
  note?: string;
}

export interface IFeatureIconData {
  id: number;
  title: string;
  subtitle: string;
}
export type ProductStatus = "ACTIVE" | "IN_ACTIVE";
export type VoucherStatus = "ACTIVE" | "IN_ACTIVE" | "EXPIRED";
export type OrderStatus =
  | "PENDING"
  | "PLACE_ORDER"
  | "WAIT_FOR_CONFIRMATION"
  | "WAIT_FOR_DELIVERY"
  | "DELIVERING"
  | "COMPLETED"
  | "CANCELED"
  | "EXPIRED"
  | "RETURNED"
  | "EXCHANGED";
export type DeliveryStatus = "PENDING" | "RETURNING" | "RECEIVED" | "COMPLETED";
export type RefundStatus = "PENDING" | "COMPLETED";

// Response

export interface IProductResponse {
  id: string;
  name: string;
  code: string;
  description: string;
  image: string;
  productDetails: IProductDetailResponse[];
  saleCount: number;
  averageRating: number;
  createdAt: number;
}
export interface IProductDetailResponse {
  id: string;
  tradeMark: ITradeMark;
  style: IStyle;
  size: ISizeResponse;
  product: IProductResponse;
  material: IMaterial;
  color: IColorResponse;
  brand: IBrandResponse;
  sole: ISole;
  image: string;
  price: number;
  quantity: number;
  saleCount: number;
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
export interface IOrderResponse {
  id: string;
  customer: ICustomerResponse;
  employee: IEmployeeResponse;
  voucher?: IVoucherResponse;
  address: IAddressResponse;
  phoneNumber: string;
  countReview: number;
  orderDetailToReview: IOrderDetailResponse[];
  reviews: IReviewResponse[];
  email: string;
  fullName: string;
  shippingMoney: number;
  totalMoney: number;
  originMoney: number;
  reduceMoney: number;
  expectedDeliveryDate: number;
  confirmationDate: number;
  deliveryStartDate: number;
  receivedDate: number;
  createdAt: number;
  note: string;
  code: string;
  orderDetails: IOrderDetailResponse[];
  orderHistories: IOrderHistoryResponse[];
  payments: IPaymentResponse[];
  status: OrderStatus;
}

export interface ICartItem {
  id: string;
  cartItemId: string;
  image: string;
  name: string;
  quantity: number;
  selectedProductColor: IColorResponse;
  selectedProductSize: ISizeClient;
  createdAt?: number;
  order?: string;
}
export interface ICartDetailResponse {
  id: string;
  cart: ICartResponse;
  productDetail: IProductDetailResponse;
  quantity: number;
  createdAt: number;
}
export interface ICartDetailRequest {
  productDetail: string;
  quantity: number;
}
export interface ICartResponse {
  id: string;
  cartDetails: ICartDetailResponse[];
}
export interface ICustomerResponse {
  id: string;
  fullName: string;
  email: string;
  dateOfBirth: number;
  gender: string;
  image: string;
  addressList: IAddressResponse[];
  customerVoucherList: IVoucherList[];
  cart: ICartItem;
}
export interface IVoucherList {
  id: string;
  voucher: IVoucherResponse;
}
export interface IAddressResponse {
  id: string;
  phoneNumber: string;
  isDefault: boolean;
  districtId: number;
  districtName: string;
  provinceId: number;
  provinceName: string;
  wardCode: string;
  wardName: string;
  more: string;
  customer: ICustomerResponse;
}
export interface IOrderHistoryResponse {
  id: string;
  order: IOrderResponse;
  actionDescription: string;
  actionStatus: OrderStatus;
  note: string;
  createdAt: number;
}
export interface IOrderDetailResponse {
  id: string;
  order: IOrderResponse;
  productDetail: IProductDetailResponse;
  quantity: number;
  price: number;
  totalPrice: number;
  status: OrderStatus;
}
export interface IPaymentResponse {
  id: string;
  order: IOrderResponse;
  paymentMethod: IPaymentMethodResponse;
  transactionCode: string;
  totalMoney: number;
  description: string;
  createdAt: number;
}
export interface IPaymentMethodResponse {
  id: string;
  name: string;
}
export interface IReviewResponse {
  id: string;
  customer: ICustomerResponse;
  productDetail: IProductDetailResponse;
  comment: string;
  rating: number;
  urlImage: string;
  createdAt: number;
}
export interface IReviewResponse {
  id: string;
  customer: ICustomerResponse;
  productDetail: IProductDetailResponse;
  comment: string;
  rating: number;
  urlImage: string;
}
export interface IEmployeeResponse {
  id: string;
  fullName: string;
  email: string;
  password: string;
  phoneNumber;
  status: UserStatus;
  gender: string;
  image: string;
  role: IRoleResponse;
  address: string;
}
// Request

export interface ICustomerRequest {
  fullName: string;
  password: string;
  email: string;
  dateOfBirth: number | string;
  gender: string;
  image?: string;
}
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
  averageRating: number;
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
export interface IOrderRequest {
  voucher?: IVoucherResponse;
  shippingMoney: number;
  customer?: string;
  address: IAddressRequest;
  fullName: string;
  email: string;
  phoneNumber: string;
  expectedDeliveryDate: number;
  cartItems: ICartItem[];
  note: string;
}
export interface IReviewRequest {
  productDetail: string;
  comment: string;
  rating: number;
  urlImage: string;
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
  WardCode: string;
}
export interface IOrderDetailRequest {
  id?: string;
  order: string;
  productDetail: string;
  quantity: number;
  price: number;
  totalPrice: number;
  status: OrderStatus;
}
export interface IProductDetailFilterVariables {
  q?: string;
  tradeMark: string;
  style: string;
  size: string;
  material: string;
  color: string;
  brand: string;
  sole: string;
  priceMin: number;
  priceMax: number;
  quantity: number;
  status: ProductStatus;
}
export interface IColorResponse {
  id: string;
  code: string;
  name: string;
  status: ProductStatus;
  createdAt: number;
}
export interface IProdAttributeResponse {
  id: string;
  name: string;
  status: ProductStatus;
}

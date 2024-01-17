import {
  ContainerOutlined,
  LoadingOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import { useModal } from "@refinedev/antd";
import {
  Authenticated,
  HttpError,
  useApiUrl,
  useCustom,
  useCustomMutation,
  useGetIdentity,
  useList,
  useNotification,
} from "@refinedev/core";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import { Form, Select, Space, Tooltip } from "antd";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { dataProvider } from "../../api/dataProvider";
import VoucherModal from "../../components/voucher/VoucherModal";
import { CurrencyFormatter, formatCurrency } from "../../helpers/currency";
import { cartItemStock, getDiscountPrice } from "../../helpers/product";
import {
  ICartItem,
  ICustomerResponse,
  IDistrict,
  IProvince,
  IVoucherList,
  IVoucherResponse,
  IWard,
} from "../../interfaces";
import {
  addToCart,
  addToDB,
  decreaseFromDB,
  decreaseQuantity,
  deleteAllFromCart,
  deleteAllFromDB,
  deleteFromCart,
  deleteFromDB,
  updateCartItemQuantity,
  updateFromDB,
} from "../../redux/slices/cart-slice";
import { setOrder } from "../../redux/slices/order-slice";
import { AppDispatch, RootState } from "../../redux/store";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { debounce } from "lodash";
import { showErrorToast } from "../../helpers/toast";
import { showWarningConfirmDialog } from "../../helpers/confirm";
import { FREE_SHIPPING_THRESHOLD } from "../../constants";
import { DiscountMessage, DiscountMoney } from "../../styled/CartStyled";
import _ from "lodash";

const GHN_API_BASE_URL = import.meta.env.VITE_GHN_API_BASE_URL;
const GHN_SHOP_ID = import.meta.env.VITE_GHN_SHOP_ID;
const GHN_TOKEN = import.meta.env.VITE_GHN_USER_TOKEN;

const Cart = () => {
  const { t } = useTranslation();
  const { open } = useNotification();
  const dispatch: AppDispatch = useDispatch();

  const API_URL = useApiUrl();

  const { getOne } = dataProvider(API_URL);

  const setTitle = useDocumentTitle();

  useEffect(() => {
    setTitle(t("nav.pages.cart") + " | SUNS");
  }, [t]);

  const { mutate: calculateFeeMutate, isLoading: isLoadingFee } =
    useCustomMutation<any>();

  let cartTotalPrice = 0;

  const [quantityCount] = useState(1);
  let { pathname } = useLocation();

  const currency = useSelector((state: RootState) => state.currency);
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const { order } = useSelector((state: RootState) => state.order);

  const [form] = Form.useForm<{
    provinceId: number;
    districtId: number;
    wardCode: string;
  }>();

  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [wards, setWards] = useState<IWard[]>([]);
  const provinceId = Form.useWatch("provinceId", form);
  const districtId = Form.useWatch("districtId", form);
  const [provinceName, setProvinceName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [wardName, setWardName] = useState("");

  const { isLoading: isLoadingProvince, refetch: refetchProvince } = useCustom<
    IProvince[]
  >({
    url: `${GHN_API_BASE_URL}/master-data/province`,
    method: "get",
    config: {
      headers: {
        token: GHN_TOKEN,
      },
    },
    queryOptions: {
      enabled: false,
      onSuccess: (data: any) => {
        setProvinces(data.response.data);
      },
    },
  });

  const { isLoading: isLoadingDistrict, refetch: refetchDistrict } = useCustom<
    IDistrict[]
  >({
    url: `${GHN_API_BASE_URL}/master-data/district`,
    method: "get",
    config: {
      headers: {
        token: GHN_TOKEN,
      },
      query: {
        province_id: provinceId,
      },
    },
    queryOptions: {
      enabled: false,
      onSuccess: (data: any) => {
        setDistricts(data.response.data);
      },
    },
  });

  const { isLoading: isLoadingWard, refetch: refetchWard } = useCustom<IWard[]>(
    {
      url: `${GHN_API_BASE_URL}/master-data/ward`,
      method: "get",
      config: {
        headers: {
          token: GHN_TOKEN,
        },
        query: {
          district_id: districtId,
        },
      },
      queryOptions: {
        enabled: false,
        onSuccess: (data: any) => {
          setWards(data.response.data);
        },
      },
    }
  );

  useEffect(() => {
    setProvinces([]);
    refetchProvince();
  }, []);

  useEffect(() => {
    if (provinceId) {
      setDistricts([]);
      refetchDistrict();
    }
  }, [provinceId]);

  useEffect(() => {
    if (districtId) {
      setWards([]);
      refetchWard();
    }
  }, [districtId]);

  const handleProvinceChange = (value: number, option: any) => {
    setProvinceName(option.label);
  };

  const handleDistrictChange = (value: number, option: any) => {
    setDistrictName(option.label);
  };

  const handleWardChange = (value: string, option: any) => {
    setWardName(option.label);
  };

  function onFinish(values: {
    provinceId: number;
    districtId: number;
    wardCode: string;
  }): void {
    calculateFeeMutate(
      {
        url: `${GHN_API_BASE_URL}/v2/shipping-order/fee`,
        method: "post",
        values: {
          from_district_id: 1542,
          service_id: 53321,
          to_district_id: values.districtId,
          to_ward_code: values.wardCode,
          height: 15,
          length: 15,
          weight: 500,
          width: 15,
          insurance_value: 500000,
        },
        config: {
          headers: {
            "Content-Type": "application/json",
            Token: GHN_TOKEN,
            ShopId: GHN_SHOP_ID,
          },
        },
        successNotification: (data: any, values) => {
          const shippingMoney = formatCurrency(
            data?.response.data.total ?? 0,
            currency
          );
          return {
            message:
              "Chi phí vận chuyển của bạn được ước tính là " + shippingMoney,
            description: "Thành công",
            type: "success",
          };
        },
        errorNotification: (data, values) => {
          return {
            message: `Đã xảy ra lỗi`,
            description: "Lỗi",
            type: "error",
          };
        },
      },
      {
        onError: (error, variables, context) => {
          console.log("An error occurred! ", +error);
        },
        onSuccess: (data: any, variables, context) => {
          dispatch(
            setOrder({
              ...order,
              address: {
                ...order.address,
                provinceName: provinceName,
                districtName: districtName,
                wardName: wardName,
                provinceId: provinceId,
                districtId: districtId,
                wardCode: form.getFieldValue("wardCode"),
              },
              shippingMoney: data?.response.data.total as number,
            })
          );
        },
      }
    );
  }

  const {
    show,
    close,
    modalProps: { visible, ...restModalProps },
  } = useModal();

  const [voucherCode, setVoucherCode] = useState("");

  const { data: user } = useGetIdentity<ICustomerResponse>();

  const [legitVouchers, setLegitVouchers] = useState<IVoucherList[]>([]);

  useEffect(() => {
    if (user && user.customerVoucherList) {
      const convertedLegitVoucher = _.cloneDeep(user.customerVoucherList);
      convertedLegitVoucher.map((single) => {
        const updatedVoucher = { ...single };
        if (single.voucher.type === "PERCENTAGE") {
          updatedVoucher.voucher.value =
            (single.voucher.value * cartTotalPrice) / 100;
        }
        return updatedVoucher;
      });

      convertedLegitVoucher.sort((a, b) => b.voucher.value - a.voucher.value);
      setLegitVouchers(convertedLegitVoucher);
    }
  }, [user]);

  const handleSubmit = async (event: React.FormEvent) => {
    try {
      event.preventDefault();

      const { data } = await getOne<IVoucherResponse>({
        resource: "vouchers/code",
        id: voucherCode,
      });

      const voucher = data ?? ({} as IVoucherResponse);

      if (voucher) {
        dispatch(
          setOrder({
            ...order,
            voucher: voucher,
          })
        );
        open?.({
          type: "success",
          message: "Áp dụng voucher thành công",
          description: "Thành công",
        });
      } else {
        open?.({
          type: "error",
          message: "Voucher không hợp lệ",
          description: "Thất bại",
        });
      }
    } catch (error: any) {
      open?.({
        type: "error",
        message: error.message,
        description: "Áp dụng voucher không thành công",
      });
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVoucherCode(event.target.value);
  };

  const updateQuantity = (cartItem: any) => {
    dispatch(updateCartItemQuantity(cartItem));
  };

  const updateQuantityFromDB = debounce((cartItem: ICartItem) => {
    dispatch(updateFromDB(cartItem));
  }, 500);

  return (
    <Fragment>
      <Breadcrumb
        pages={[
          { label: "home", path: "/" },
          { label: "pages.cart", path: pathname },
        ]}
      />
      <div className="cart-main-area pt-90 pb-100 bg-white">
        <div className="container">
          {cartItems && cartItems.length >= 1 ? (
            <Fragment>
              <h3 className="cart-page-title">{t(`cart.title`)}</h3>
              <div className="row">
                <div className="col-12">
                  <div className="table-content table-responsive cart-table-content">
                    <table>
                      <thead>
                        <tr>
                          <th>{t(`cart.table.head.image`)}</th>
                          <th>{t(`cart.table.head.product_name`)}</th>
                          <th>{t(`cart.table.head.unit_price`)}</th>
                          <th>{t(`cart.table.head.qty`)}</th>
                          <th>{t(`cart.table.head.subtotal`)}</th>
                          <th>{t(`cart.table.head.action`)}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map((cartItem, key) => {
                          const discountedPrice = getDiscountPrice(
                            cartItem.selectedProductSize?.price ?? 0,
                            0
                          );
                          const finalProductPrice =
                            (cartItem.selectedProductSize?.price ?? 0) *
                            currency.currencyRate;
                          const finalDiscountedPrice =
                            discountedPrice !== null
                              ? discountedPrice * currency.currencyRate
                              : 0.0;

                          discountedPrice !== null
                            ? (cartTotalPrice +=
                                finalDiscountedPrice * cartItem.quantity)
                            : (cartTotalPrice +=
                                finalProductPrice * cartItem.quantity);

                          return (
                            <tr key={key}>
                              <td className="product-thumbnail">
                                <Link to={"/product/" + cartItem.cartItemId}>
                                  <img
                                    className="img-fluid"
                                    src={cartItem.image}
                                    alt=""
                                  />
                                </Link>
                              </td>

                              <td className="product-name">
                                <Link to={"/product/" + cartItem.cartItemId}>
                                  {cartItem.name}
                                </Link>
                                {cartItem.selectedProductColor &&
                                cartItem.selectedProductSize ? (
                                  <div className="cart-item-variation">
                                    <span>
                                      {t(`cart.table.head.color`)}:{" "}
                                      {cartItem.selectedProductColor.name}
                                    </span>
                                    <span>
                                      {t(`cart.table.head.size`)}:{" "}
                                      {cartItem.selectedProductSize.name}
                                    </span>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </td>

                              <td className="product-price-cart">
                                {discountedPrice !== null ? (
                                  <Fragment>
                                    <CurrencyFormatter
                                      className="amount old"
                                      value={finalProductPrice}
                                      currency={currency}
                                    />
                                    <CurrencyFormatter
                                      className="amount"
                                      value={finalDiscountedPrice}
                                      currency={currency}
                                    />
                                  </Fragment>
                                ) : (
                                  <CurrencyFormatter
                                    className="amount"
                                    value={finalProductPrice}
                                    currency={currency}
                                  />
                                )}
                              </td>

                              <td className="product-quantity">
                                <div className="cart-plus-minus">
                                  <Authenticated
                                    fallback={
                                      <button
                                        className="dec qtybutton"
                                        onClick={() => {
                                          if (cartItem.quantity <= 1) {
                                            showWarningConfirmDialog({
                                              options: {
                                                message:
                                                  "Giảm số lượng về 0 tương đương với việc loại bỏ sản phẩm khỏi giỏ",
                                                accept: () => {
                                                  dispatch(
                                                    decreaseQuantity(cartItem)
                                                  );
                                                },
                                                reject: () => {},
                                              },
                                              t: t,
                                            });
                                          } else {
                                            dispatch(
                                              decreaseQuantity(cartItem)
                                            );
                                          }
                                        }}
                                      >
                                        -
                                      </button>
                                    }
                                  >
                                    <button
                                      className="dec qtybutton"
                                      onClick={() => {
                                        if (cartItem.quantity <= 1) {
                                          showWarningConfirmDialog({
                                            options: {
                                              message:
                                                "Giảm số lượng về 0 tương đương với việc loại bỏ sản phẩm khỏi giỏ",
                                              accept: () => {
                                                dispatch(
                                                  decreaseFromDB(cartItem)
                                                );
                                              },
                                              reject: () => {},
                                            },
                                            t: t,
                                          });
                                        } else {
                                          dispatch(decreaseFromDB(cartItem));
                                        }
                                      }}
                                    >
                                      -
                                    </button>
                                  </Authenticated>
                                  <Authenticated
                                    fallback={
                                      <input
                                        className="cart-plus-minus-box"
                                        type="text"
                                        value={cartItem.quantity}
                                        onChange={(e) => {
                                          const newValue = parseInt(
                                            e.target.value,
                                            10
                                          );
                                          if (
                                            newValue >=
                                            cartItemStock(
                                              cartItem.selectedProductSize
                                            )
                                          ) {
                                            return showErrorToast(
                                              "Rất tiếc, đã đạt giới hạn số lượng sản phẩm"
                                            );
                                          }
                                          if (newValue > 5) {
                                            return showErrorToast(
                                              "Bạn chỉ có thể mua tối da 5 sản phẩm, vui lòng liên hệ với chúng tôi nếu có nhu cầu mua số lượng lớn"
                                            );
                                          }
                                          if (!isNaN(newValue)) {
                                            updateQuantity({
                                              ...cartItem,
                                              quantity: newValue,
                                            });
                                          }
                                        }}
                                      />
                                    }
                                  >
                                    <input
                                      className="cart-plus-minus-box"
                                      type="text"
                                      value={cartItem.quantity}
                                      onChange={(e) => {
                                        const newValue = parseInt(
                                          e.target.value,
                                          10
                                        );
                                        if (
                                          newValue >=
                                          cartItemStock(
                                            cartItem.selectedProductSize
                                          )
                                        ) {
                                          return showErrorToast(
                                            "Rất tiếc, đã đạt giới hạn số lượng sản phẩm"
                                          );
                                        }
                                        if (newValue > 5) {
                                          return showErrorToast(
                                            "Bạn chỉ có thể mua tối da 5 sản phẩm, vui lòng liên hệ với chúng tôi nếu có nhu cầu mua số lượng lớn"
                                          );
                                        }
                                        if (!isNaN(newValue)) {
                                          updateQuantity({
                                            ...cartItem,
                                            quantity: newValue,
                                            showNoti: false,
                                          });
                                          updateQuantityFromDB({
                                            ...cartItem,
                                            quantity: newValue,
                                          });
                                        }
                                      }}
                                    />
                                  </Authenticated>
                                  <Authenticated
                                    fallback={
                                      <button
                                        className="inc qtybutton"
                                        onClick={() => {
                                          if (
                                            cartItem !== undefined &&
                                            cartItem.quantity !== undefined &&
                                            cartItem.quantity >=
                                              cartItemStock(
                                                cartItem.selectedProductSize
                                              )
                                          ) {
                                            return showErrorToast(
                                              "Rất tiếc, đã đạt giới hạn số lượng sản phẩm"
                                            );
                                          }

                                          if (cartItem.quantity >= 5) {
                                            return showErrorToast(
                                              "Bạn chỉ có thể mua tối da 5 sản phẩm, vui lòng liên hệ với chúng tôi nếu có nhu cầu mua số lượng lớn"
                                            );
                                          }
                                          dispatch(
                                            addToCart({
                                              ...cartItem,
                                              quantity: quantityCount,
                                            })
                                          );
                                        }}
                                      >
                                        +
                                      </button>
                                    }
                                  >
                                    <button
                                      className="inc qtybutton"
                                      onClick={() => {
                                        if (
                                          cartItem !== undefined &&
                                          cartItem.quantity !== undefined &&
                                          cartItem.quantity >=
                                            cartItemStock(
                                              cartItem.selectedProductSize
                                            )
                                        ) {
                                          return showErrorToast(
                                            "Rất tiếc, đã đạt giới hạn số lượng sản phẩm"
                                          );
                                        }

                                        if (cartItem.quantity >= 5) {
                                          return showErrorToast(
                                            "Bạn chỉ có thể mua tối da 5 sản phẩm, vui lòng liên hệ với chúng tôi nếu có nhu cầu mua số lượng lớn"
                                          );
                                        }
                                        dispatch(
                                          addToDB({
                                            ...cartItem,
                                            quantity: quantityCount,
                                          })
                                        );
                                      }}
                                    >
                                      +
                                    </button>
                                  </Authenticated>
                                </div>
                              </td>
                              <td className="product-subtotal">
                                <CurrencyFormatter
                                  className="amount"
                                  value={
                                    discountedPrice !== null
                                      ? finalDiscountedPrice * cartItem.quantity
                                      : finalProductPrice * cartItem.quantity
                                  }
                                  currency={currency}
                                />
                              </td>

                              <td className="product-remove">
                                <Authenticated
                                  fallback={
                                    <button
                                      onClick={() =>
                                        dispatch(deleteFromCart(cartItem.id))
                                      }
                                    >
                                      <i className="fa fa-times"></i>
                                    </button>
                                  }
                                >
                                  <button
                                    onClick={() =>
                                      dispatch(deleteFromDB(cartItem.id))
                                    }
                                  >
                                    <i className="fa fa-times"></i>
                                  </button>
                                </Authenticated>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="cart-shiping-update-wrapper">
                    <div className="cart-shiping-update">
                      <Link to={"/shop"}>
                        {t(`cart.buttons.continue_shopping`)}
                      </Link>
                    </div>
                    <div className="cart-clear">
                      <Authenticated
                        fallback={
                          <button onClick={() => dispatch(deleteAllFromCart())}>
                            {t(`cart.buttons.clear_cart`)}
                          </button>
                        }
                      >
                        <button onClick={() => dispatch(deleteAllFromDB())}>
                          {t(`cart.buttons.clear_cart`)}
                        </button>
                      </Authenticated>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row justify-content-between">
                <div className="col-lg-4 col-md-6">
                  <div className="cart-tax">
                    <div className="title-wrap">
                      <h4 className="cart-bottom-title section-bg-gray">
                        {t(`cart.shipping.title`)}
                      </h4>
                    </div>
                    <div className="tax-wrapper">
                      <p>{t(`cart.shipping.subtitle`)}</p>
                      <Form
                        form={form}
                        name="shipping-address"
                        layout="vertical"
                        onFinish={onFinish}
                        // onFinishFailed={onFinishFailed}
                        autoComplete="off"
                      >
                        <div className="tax-select-wrapper">
                          <div className="">
                            <Form.Item
                              label={t(`cart.shipping.address.province.title`)}
                              name="provinceId"
                              rules={[
                                {
                                  required: true,
                                  message: "Hãy chọn tỉnh/thành phố trước!",
                                },
                              ]}
                              initialValue={
                                order.address
                                  ? Number(order.address.provinceId)
                                  : ""
                              }
                            >
                              <Select
                                className="email s-email s-wid"
                                showSearch
                                placeholder={"Chọn tỉnh/thành phố"}
                                loading={isLoadingProvince}
                                onChange={handleProvinceChange}
                                filterOption={filterOption}
                                options={provinces.map((province) => ({
                                  label: province.ProvinceName,
                                  value: province.ProvinceID,
                                }))}
                              />
                            </Form.Item>
                          </div>
                          <div className="">
                            <Form.Item
                              label={t(`cart.shipping.address.district.title`)}
                              name="districtId"
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng chọn quận/huyện!",
                                },
                              ]}
                              initialValue={
                                order.address
                                  ? Number(order.address.districtId)
                                  : ""
                              }
                            >
                              <Select
                                className="email s-email s-wid"
                                showSearch
                                placeholder={"Chọn quận/huyện"}
                                loading={isLoadingDistrict}
                                onChange={handleDistrictChange}
                                filterOption={filterOption}
                                options={districts.map((district) => ({
                                  label: district.DistrictName,
                                  value: district.DistrictID,
                                }))}
                              />
                            </Form.Item>
                          </div>
                          <div className="">
                            <Form.Item
                              label={t(`cart.shipping.address.ward.title`)}
                              name="wardCode"
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng chọn phường/xã!",
                                },
                              ]}
                              initialValue={
                                order.address ? order.address.wardCode : ""
                              }
                            >
                              <Select
                                className="email s-email s-wid"
                                showSearch
                                placeholder={"Chọn phường/xã phố"}
                                loading={isLoadingWard}
                                onChange={handleWardChange}
                                filterOption={filterOption}
                                options={wards.map((ward) => ({
                                  label: ward.WardName,
                                  value: ward.WardCode,
                                }))}
                              />
                            </Form.Item>
                          </div>
                          <button
                            className="cart-btn-2"
                            disabled={isLoadingFee}
                          >
                            {isLoadingFee && (
                              <span className="loading">
                                <LoadingOutlined />
                              </span>
                            )}
                            {t("cart.buttons.get_a_quote")}
                          </button>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>

                <Authenticated fallback={false}>
                  <div className="col-lg-4 col-md-6">
                    <div className="discount-code-wrapper">
                      <div className="title-wrap">
                        <h4 className="cart-bottom-title section-bg-gray">
                          {t(`cart.voucher.title`)}
                        </h4>
                      </div>
                      <div className="discount-code">
                        <p>{t(`cart.voucher.subtitle`)}</p>
                        <form onSubmit={handleSubmit}>
                          <input
                            type="text"
                            required
                            name="voucher_code"
                            value={voucherCode}
                            onChange={handleChange}
                          />
                          <Space>
                            <button className="cart-btn-2" type="submit">
                              {t(`cart.buttons.apply_voucher`)}
                            </button>
                            <Tooltip title="Xem voucher">
                              <button
                                className="cart-btn-3"
                                type="button"
                                onClick={show}
                              >
                                <ContainerOutlined />
                              </button>
                            </Tooltip>
                          </Space>
                        </form>
                      </div>
                    </div>
                  </div>
                </Authenticated>

                <div className="col-lg-4 col-md-12">
                  <div className="grand-total">
                    <div className="title-wrap">
                      <h4 className="cart-bottom-title section-bg-gary-cart">
                        {t(`cart.cart_total.title`)}
                      </h4>
                    </div>
                    <h5>
                      {t(`cart.cart_total.total`)}{" "}
                      <CurrencyFormatter
                        value={cartTotalPrice}
                        currency={currency}
                      />
                    </h5>
                    <h5>
                      {t(`cart.cart_total.shipping`)}{" "}
                      {cartTotalPrice >= FREE_SHIPPING_THRESHOLD ? (
                        <span className="free-shipping">
                          Miễn phí vận chuyển
                        </span>
                      ) : (
                        <CurrencyFormatter
                          value={order.shippingMoney ?? 0}
                          currency={currency}
                        />
                      )}
                    </h5>
                    <h5>
                      {"Giảm giá"}{" "}
                      <CurrencyFormatter
                        value={
                          order.voucher
                            ? order.voucher.type == "PERCENTAGE"
                              ? (order.voucher.value / 100) * cartTotalPrice
                              : order.voucher.value
                            : 0
                        }
                        currency={currency}
                      />
                    </h5>
                    <h4 className="grand-total-title">
                      {t(`cart.cart_total.grand_total`)}{" "}
                      <CurrencyFormatter
                        value={cartTotalPrice}
                        currency={currency}
                      />
                    </h4>
                    <hr />
                    <div>
                      {(() => {
                        const freeShippingDifference =
                          FREE_SHIPPING_THRESHOLD - cartTotalPrice;
                        const voucherDifference =
                          legitVouchers && legitVouchers.length > 0
                            ? legitVouchers[0].voucher.constraint -
                              cartTotalPrice
                            : Infinity;

                        const shouldDisplayFreeShipping =
                          freeShippingDifference > 0 &&
                          freeShippingDifference <= voucherDifference;
                        const shouldDisplayVoucher =
                          voucherDifference > 0 &&
                          voucherDifference < freeShippingDifference;

                        if (shouldDisplayFreeShipping) {
                          return (
                            <DiscountMessage className="message">
                              <GiftOutlined /> Mua thêm{" "}
                              <DiscountMoney>
                                {formatCurrency(
                                  freeShippingDifference,
                                  currency
                                )}
                              </DiscountMoney>{" "}
                              để được miễn phí vận chuyển
                            </DiscountMessage>
                          );
                        } else if (shouldDisplayVoucher) {
                          return (
                            <DiscountMessage className="message">
                              <GiftOutlined /> Mua thêm{" "}
                              <DiscountMoney>
                                {formatCurrency(voucherDifference, currency)}
                              </DiscountMoney>{" "}
                              để được giảm tới{" "}
                              <DiscountMoney>
                                {formatCurrency(
                                  legitVouchers[0].voucher.value,
                                  currency
                                )}
                              </DiscountMoney>
                            </DiscountMessage>
                          );
                        } else {
                          return null;
                        }
                      })()}
                    </div>
                    <Link to={"/pages/checkout"} className="mt-3">
                      {t(`cart.buttons.proceed_to_checkout`)}
                    </Link>
                  </div>
                </div>
              </div>
            </Fragment>
          ) : (
            <div className="row">
              <div className="col-lg-12">
                <div className="item-empty-area text-center">
                  <div className="item-empty-area__icon mb-30">
                    <i className="pe-7s-cart"></i>
                  </div>
                  <div className="item-empty-area__text">
                    {t(`cart.no_items_found`)}
                    <br />{" "}
                    <Link to={"/shop"}>{t(`cart.buttons.add_items`)}</Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Authenticated fallback={false}>
        <VoucherModal
          restModalProps={restModalProps}
          vouchers={user?.customerVoucherList || []}
        />
      </Authenticated>
    </Fragment>
  );
};

export default Cart;

const filterOption = (
  input: string,
  option?: { label: string; value: number | string }
) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

import { GiftOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import { Form, Image, RadioChangeEvent, Spin } from "antd";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { getDiscountPrice } from "../../helpers/product";
import {
  ICustomerResponse,
  IDistrict,
  IProvince,
  IVoucherList,
  IWard,
} from "../../interfaces";
import { AppDispatch, RootState } from "../../redux/store";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";

import { useModal } from "@refinedev/antd";
import {
  Authenticated,
  useCreate,
  useCustom,
  useCustomMutation,
  useGetIdentity,
} from "@refinedev/core";
import dayjs from "dayjs";
import _, { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import { ListAddressModal } from "../../components/address/ListAddressModal";
import PaymentMethodAccordion from "../../components/payment-methods/PaymentMethodAccordion";
import DiscountCodeAccordion from "../../components/voucher/DiscountCodeAccordion";
import { FREE_SHIPPING_THRESHOLD, MAX_TEXT_AREA_LENGTH } from "../../constants";
import { CurrencyFormatter, formatCurrency } from "../../helpers/currency";
import {
  deleteAllFromCart,
  deleteAllFromDB,
  updateCartItemsOrder,
} from "../../redux/slices/cart-slice";
import {
  clearOrder,
  clearVoucher,
  setOrder,
} from "../../redux/slices/order-slice";
import { DiscountMessage, DiscountMoney } from "../../styled/CartStyled";
import { TOKEN_KEY } from "../../utils";
import {
  validateCommon,
  validateEmail,
  validateFullName,
  validatePhoneNumber,
} from "../../helpers/validate";
import { motion } from "framer-motion";

const GHN_API_BASE_URL = import.meta.env.VITE_GHN_API_BASE_URL;
const GHN_SHOP_ID = import.meta.env.VITE_GHN_SHOP_ID;
const GHN_TOKEN = import.meta.env.VITE_GHN_USER_TOKEN;

const CheckOut = () => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();

  const setTitle = useDocumentTitle();

  useEffect(() => {
    setTitle(t("nav.pages.checkout") + " | SUNS");
  }, [t]);

  const { data: user, refetch } = useGetIdentity<ICustomerResponse>();

  const { mutate, isLoading } = useCreate();

  const navigate = useNavigate();

  let { pathname } = useLocation();
  const currency = useSelector((state: RootState) => state.currency);
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const { order } = useSelector((state: RootState) => state.order);

  let cartTotalPrice = 0;
  let discount = 0;

  const [textAreaCount, setTextAreaCount] = useState(0);

  const recalculate = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextAreaCount(e.target.value.length);
  };

  const [shippingMoney, setShippingMoney] = useState(order.shippingMoney ?? 0);

  useEffect(() => {
    if (cartTotalPrice >= FREE_SHIPPING_THRESHOLD) setShippingMoney(0);
  }, [cartTotalPrice]);

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

  const [form] = Form.useForm<{
    provinceId: number;
    districtId: number;
    wardCode: string;
    line: string;
    full_name: string;
    phone_number: string;
    email: string;
    gender: string;
    date_of_birth: string;
    order_note: string;
  }>();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "Cash" | "Card"
  >("Cash");

  const handlePaymentMethodChange = (e: RadioChangeEvent) => {
    setSelectedPaymentMethod(e.target.value);
  };

  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [wards, setWards] = useState<IWard[]>([]);
  const provinceId = Form.useWatch("provinceId", form);
  const districtId = Form.useWatch("districtId", form);
  const wardCode = Form.useWatch("wardCode", form);
  const [provinceName, setProvinceName] = useState(
    order.address ? order.address.provinceName || "" : ""
  );
  const [districtName, setDistrictName] = useState(
    order.address ? order.address.districtName || "" : ""
  );
  const [wardName, setWardName] = useState(
    order.address ? order.address.wardName || "" : ""
  );

  const handleFormChange = debounce(
    (
      changedValues: any,
      values: {
        provinceId: number;
        districtId: number;
        wardCode: string;
        line: string;
        full_name: string;
        phone_number: string;
        email: string;
        gender: string;
        date_of_birth: string;
        order_note: string;
      }
    ) => {
      const address = {
        phoneNumber: values.phone_number,
        provinceName: provinceName,
        districtName: districtName,
        wardName: wardName,
        provinceId: values.provinceId,
        districtId: values.districtId,
        wardCode: values.wardCode,
        more: values.line,
      };

      const updatedOrder = {
        ...order,
        fullName: values.full_name,
        email: values.email,
        note: values.order_note,
        address: address,
      };

      dispatch(setOrder(updatedOrder));
    },
    500
  );

  const { mutate: calculateFeeMutate, isLoading: isLoadingFee } =
    useCustomMutation<any>();

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
    if (user) {
      let updatedOrder = _.cloneDeep(order);
      const defaultAddress = user.addressList.find(
        (add) => add.isDefault === true
      );
      const hasDefaultAddress = !!defaultAddress;

      if (!order.address && hasDefaultAddress) {
        const {
          phoneNumber,
          provinceId,
          districtId,
          wardCode,
          districtName,
          provinceName,
          wardName,
          more,
        } = defaultAddress;

        form.setFieldsValue({
          phone_number: phoneNumber,
          provinceId: Number(provinceId),
          districtId: Number(districtId),
          wardCode: wardCode,
          line: more,
        });

        setDistrictName(districtName);
        setProvinceName(provinceName);
        setWardName(wardName);

        updatedOrder.address = {
          phoneNumber,
          provinceName: districtName,
          districtName: provinceName,
          wardName,
          provinceId: Number(provinceId),
          districtId: Number(districtId),
          wardCode,
          more,
        };
      }

      if (!order.fullName && !order.email) {
        const dob = dayjs(new Date(user.dateOfBirth)).format("YYYY-MM-DD");
        const { fullName, email, gender } = user;

        form.setFieldsValue({
          full_name: fullName,
          email,
          gender,
          date_of_birth: dob,
        });

        updatedOrder = {
          ...updatedOrder,
          fullName,
          email,
        };
      }

      if (!_.isEqual(order, updatedOrder)) {
        dispatch(setOrder(updatedOrder));
      }
    }
  }, [user, order]);

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

  useEffect(() => {
    if (provinceId && districtId && wardCode) {
      calculateFeeMutate(
        {
          url: `${GHN_API_BASE_URL}/v2/shipping-order/fee`,
          method: "post",
          values: {
            from_district_id: 1542,
            service_id: 53321,
            to_district_id: Number(districtId),
            to_ward_code: wardCode,
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
          successNotification: false,
          errorNotification: false,
        },
        {
          onError: (error, variables, context) => {
            console.log("An error occurred! ", +error);

            const shippingMoney = 36500;
            setShippingMoney(shippingMoney);
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
                shippingMoney: shippingMoney as number,
              })
            );
          },
          onSuccess: (data: any, variables, context) => {
            const shippingMoney = data?.response.data.total;
            setShippingMoney(shippingMoney);
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
                shippingMoney: shippingMoney as number,
              })
            );
          },
        }
      );
    }
  }, [provinceId, districtId, wardCode]);

  const handleProvinceChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedProvinceID = Number(event.target.value);
    const selectedProvince = provinces.find(
      (p) => p.ProvinceID === selectedProvinceID
    );

    if (selectedProvince) {
      const provinceName = selectedProvince.ProvinceName;
      setProvinceName(provinceName);
      form.setFieldValue("districtId", null);
      form.setFieldValue("wardCode", "");
    }
  };

  const handleDistrictChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedDistrictID = Number(event.target.value);
    const selectedDistrict = districts.find(
      (d) => d.DistrictID === selectedDistrictID
    );

    if (selectedDistrict) {
      const districtName = selectedDistrict.DistrictName;
      setDistrictName(districtName);
    }
  };

  const handleWardChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedWard = wards.find((w) => w.WardCode === event.target.value);

    if (selectedWard) {
      const wardName = selectedWard.WardName;
      setWardName(wardName);
    }
  };

  function onFinish(values: {
    provinceId: number;
    districtId: number;
    wardCode: string;
    line: string;
    full_name: string;
    phone_number: string;
    email: string;
    gender: string;
    date_of_birth: string;
    order_note: string;
  }): void {
    4;
    const simplifiedCartItems: { id: string; quantity: number }[] =
      cartItems.map((item) => {
        const {
          selectedProductSize: { productDetailId },
          quantity,
        } = item;
        return { id: productDetailId, quantity };
      });
    const submitData = {
      customer: user?.id ?? "",
      employee: "",
      voucher: order.voucher ? order.voucher.id : "",
      phoneNumber: values.phone_number,
      fullName: values.full_name,
      email: values.email,
      shippingMoney,
      note: values.order_note,
      paymentMethod: selectedPaymentMethod,
      addressShipping: {
        phoneNumber: values.phone_number,
        districtId: values.districtId,
        districtName: districtName,
        provinceId: values.provinceId,
        provinceName: provinceName,
        wardCode: values.wardCode,
        wardName: wardName,
        more: values.line,
      },
      cartItems: simplifiedCartItems,
    };

    mutate(
      {
        resource: "orders",
        values: submitData,
        successNotification: false,
        errorNotification: (error: any) => {
          return {
            message: error.message,
            description: "Đã xẩy ra lỗi",
            type: "error",
          };
        },
      },
      {
        onError: (error, variables, context) => {
          console.log("An error occurred! " + error.message);
        },
        onSuccess: (data, variables, context) => {
          if (selectedPaymentMethod === "Cash") {
            navigate("/success/" + data.data.id);

            dispatch(clearOrder());

            const token = localStorage.getItem(TOKEN_KEY);

            if (token) {
              dispatch(deleteAllFromDB());
            } else {
              dispatch(deleteAllFromCart());
            }
          } else {
            const url = data.data;

            const urlParams = new URLSearchParams(url.split("?")[1]);
            const orderInfo = urlParams.get("vnp_OrderInfo");

            dispatch(updateCartItemsOrder(orderInfo));
            window.location.href = url + "";
          }
        },
      }
    );
  }

  const {
    show,
    close,
    modalProps: { visible, ...restModalProps },
  } = useModal();

  return (
    <Fragment>
      <Spin spinning={isLoading} fullscreen />
      <Breadcrumb
        pages={[
          { label: "home", path: "/" },
          { label: "pages.checkout", path: pathname },
        ]}
      />
      <div className="checkout-area pt-95 pb-100 bg-white">
        <div className="container">
          {cartItems && cartItems.length >= 1 ? (
            <div className="row">
              <Form
                form={form}
                name="billing-info"
                layout="inline"
                onFinish={onFinish}
                // onFinishFailed={onFinishFailed}
                autoComplete="off"
                onValuesChange={handleFormChange}
                initialValues={{
                  full_name: order.fullName || "",
                  email: order.email || "",
                  gender: "",
                  date_of_birth: "",
                  phone_number: getDefaultIfEmptyOrNull(
                    order.address?.phoneNumber,
                    null
                  ),
                  provinceId: getDefaultIfEmptyOrNull(
                    order.address?.provinceId,
                    null
                  ),
                  districtId: Number(
                    getDefaultIfEmptyOrNull(order.address?.districtId, null)
                  ),
                  wardCode: getDefaultIfEmptyOrNull(
                    order.address?.wardCode,
                    null
                  ),
                  line: getDefaultIfEmptyOrNull(order.address?.more, null),
                }}
              >
                <div className="col-lg-7">
                  <div className="billing-info-wrap">
                    <div className="row">
                      <div className="col">
                        <h3>{t("checkout.billing_details.title")}</h3>
                      </div>
                      <div className="col text-end">
                        <Authenticated fallback={false}>
                          <button
                            style={{ marginInlineEnd: "16px" }}
                            onClick={(event) => {
                              event.preventDefault();
                              show();
                            }}
                          >
                            Chọn địa chỉ của bạn
                          </button>
                        </Authenticated>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-12">
                        <div className="billing-info mb-20">
                          <label>
                            {t("checkout.billing_details.full_name")}
                          </label>
                          <Form.Item
                            name="full_name"
                            rules={[
                              {
                                validator: validateFullName,
                              },
                            ]}
                          >
                            <input type="text" />
                          </Form.Item>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>
                            {t("checkout.billing_details.phone_number")}
                          </label>
                          <Form.Item
                            name="phone_number"
                            rules={[{ validator: validatePhoneNumber }]}
                          >
                            <input type="text" />
                          </Form.Item>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>{t("checkout.billing_details.email")}</label>
                          <Form.Item
                            name="email"
                            rules={[
                              {
                                validator: validateEmail,
                              },
                            ]}
                          >
                            <input type="text" />
                          </Form.Item>
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="billing-select mb-20">
                          <label>
                            {t("checkout.billing_details.province.title")}
                          </label>
                          <Form.Item
                            name="provinceId"
                            rules={[
                              {
                                validator: (_, value) =>
                                  validateCommon(_, value, t, "provinceId"),
                              },
                            ]}
                          >
                            {provinces && provinces.length > 0 ? (
                              <select onChange={handleProvinceChange}>
                                <option value="">
                                  --Chọn tỉnh/thành phố--
                                </option>
                                {provinces.map((province, index) => (
                                  <option
                                    key={index}
                                    value={province.ProvinceID}
                                  >
                                    {province.ProvinceName}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <select>
                                <option value="">
                                  Đang tải tỉnh/thành phố...
                                </option>
                              </select>
                            )}
                          </Form.Item>
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="billing-select mb-20">
                          <label>
                            {t("checkout.billing_details.district.title")}
                          </label>
                          <Form.Item
                            name="districtId"
                            rules={[
                              {
                                validator: (_, value) =>
                                  validateCommon(_, value, t, "districtId"),
                              },
                            ]}
                          >
                            {districts && districts.length > 0 ? (
                              <select onChange={handleDistrictChange}>
                                <option value="">--Chọn quận/huyện--</option>
                                {districts.map((district, index) => (
                                  <option
                                    key={index}
                                    value={district.DistrictID}
                                  >
                                    {district.DistrictName}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <select>
                                <option value="">Đang tải quận/huyện...</option>
                              </select>
                            )}
                          </Form.Item>
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="billing-select mb-20">
                          <label>
                            {t("checkout.billing_details.ward.title")}
                          </label>
                          <Form.Item
                            name="wardCode"
                            rules={[
                              {
                                validator: (_, value) =>
                                  validateCommon(_, value, t, "wardCode"),
                              },
                            ]}
                          >
                            {wards && wards.length > 0 ? (
                              <select onChange={handleWardChange}>
                                <option value="">--Chọn phường/xã--</option>
                                {wards.map((ward, index) => (
                                  <option key={index} value={ward.WardCode}>
                                    {ward.WardName}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <select>
                                <option value="">Đang tải phường/...</option>
                              </select>
                            )}
                          </Form.Item>
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="billing-info mb-20">
                          <label>{t("checkout.billing_details.line")}</label>
                          <Form.Item
                            name="line"
                            rules={[
                              {
                                validator: (_, value) =>
                                  validateCommon(_, value, t, "line"),
                              },
                            ]}
                          >
                            <input type="text" />
                          </Form.Item>
                        </div>
                      </div>
                    </div>

                    <div className="additional-info-wrap">
                      <h4>
                        {t(
                          "checkout.billing_details.additional_information.title"
                        )}
                      </h4>
                      <div className="additional-info">
                        <Form.Item>
                          <div className="d-flex justify-content-between">
                            <label>
                              {t(
                                "checkout.billing_details.additional_information.order_note.title"
                              )}
                            </label>
                            <label>{`${textAreaCount} / ${MAX_TEXT_AREA_LENGTH}`}</label>
                          </div>
                        </Form.Item>
                        <Form.Item name="order_note">
                          <textarea
                            placeholder={
                              t(
                                "checkout.billing_details.additional_information.order_note.place_holder",
                                { textAreaCount: MAX_TEXT_AREA_LENGTH }
                              ) ?? ""
                            }
                            onChange={recalculate}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-5">
                  <div className="your-order-area mb-2">
                    <h3>{t("checkout.your_order.title")}</h3>
                    <div className="your-order-wrap gray-bg-4">
                      <div className="your-order-product-info">
                        <div className="your-order-top">
                          <ul>
                            <li>{t("checkout.your_order.product")}</li>
                            <li>{t("checkout.your_order.total")}</li>
                          </ul>
                        </div>
                        <div className="your-order-middle">
                          <ul>
                            {cartItems.map((cartItem, key) => {
                              const discountValue =
                                cartItem.selectedProductSize?.discount ?? 0;
                              const discountedPrice = getDiscountPrice(
                                cartItem.selectedProductSize?.price ?? 0,
                                discountValue
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

                              discount = order.voucher
                                ? order.voucher.type == "PERCENTAGE"
                                  ? (order.voucher.value * cartTotalPrice) / 100
                                  : order.voucher.value
                                : 0;

                              return (
                                <li key={key}>
                                  <span className="order-middle-left">
                                    {cartItem.name} X {cartItem.quantity}
                                  </span>{" "}
                                  <CurrencyFormatter
                                    className="order-price"
                                    value={
                                      discountedPrice !== null
                                        ? finalDiscountedPrice *
                                          cartItem.quantity
                                        : finalProductPrice * cartItem.quantity
                                    }
                                    currency={currency}
                                  />
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                        <div className="your-order-bottom">
                          <ul>
                            <li className="your-order-shipping">
                              {t("checkout.your_order.shipping")}{" "}
                              <Image
                                preview={false}
                                src="/images/payment-methods/Icon-GHN.png"
                                style={{ maxWidth: "50px", height: "auto" }}
                              />
                            </li>
                            <li>
                              {cartTotalPrice >= FREE_SHIPPING_THRESHOLD ? (
                                <span className="free-shipping">
                                  Miễn phí vận chuyển
                                </span>
                              ) : (
                                <>
                                  {order.address ? (
                                    <CurrencyFormatter
                                      value={shippingMoney}
                                      currency={currency}
                                    />
                                  ) : (
                                    <span className="free-shipping">
                                      Vui lòng chọn địa chỉ
                                    </span>
                                  )}
                                </>
                              )}
                            </li>
                          </ul>
                          <ul>
                            <li className="your-order-voucher">
                              Giảm giá{" "}
                              {order.voucher && (
                                <MinusCircleOutlined
                                  className="remove-voucher"
                                  onClick={() => dispatch(clearVoucher())}
                                />
                              )}
                            </li>
                            <li>
                              <CurrencyFormatter
                                value={discount}
                                currency={currency}
                              />
                            </li>
                          </ul>
                        </div>
                        <div className="discount-message">
                          {(() => {
                            const freeShippingDifference =
                              cartTotalPrice < FREE_SHIPPING_THRESHOLD
                                ? FREE_SHIPPING_THRESHOLD - cartTotalPrice
                                : Infinity;

                            const voucherDifference =
                              legitVouchers && legitVouchers.length > 0
                                ? cartTotalPrice <
                                  legitVouchers[0].voucher.constraint
                                  ? legitVouchers[0].voucher.constraint -
                                    cartTotalPrice
                                  : Infinity
                                : Infinity;

                            const shouldDisplayFreeShipping =
                              freeShippingDifference > 0 &&
                              freeShippingDifference !== Infinity &&
                              freeShippingDifference <= voucherDifference;
                            const shouldDisplayVoucher =
                              voucherDifference > 0 &&
                              voucherDifference !== Infinity &&
                              voucherDifference < freeShippingDifference;

                            if (shouldDisplayFreeShipping) {
                              return (
                                <DiscountMessage>
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
                                <DiscountMessage>
                                  <GiftOutlined /> Mua thêm{" "}
                                  <DiscountMoney>
                                    {formatCurrency(
                                      voucherDifference,
                                      currency
                                    )}
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
                        <div className="your-order-total">
                          <ul>
                            <li className="order-total">
                              {t("checkout.your_order.total_money")}
                            </li>
                            <li>
                              <CurrencyFormatter
                                value={
                                  Math.max(cartTotalPrice - discount, 0) +
                                  (cartTotalPrice < FREE_SHIPPING_THRESHOLD
                                    ? shippingMoney
                                    : 0)
                                }
                                currency={currency}
                              />
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="payment-method"></div>
                    </div>
                  </div>
                  <div className="your-order-area mb-2 payment-methods-wrapper">
                    <Authenticated fallback={false}>
                      <DiscountCodeAccordion
                        totalMoney={cartTotalPrice + shippingMoney - discount}
                        vouchers={user?.customerVoucherList || []}
                      />
                    </Authenticated>
                  </div>
                  <div className="your-order-area">
                    <PaymentMethodAccordion
                      selectedPaymentMethod={selectedPaymentMethod}
                      handlePaymentMethodChange={handlePaymentMethodChange}
                    />
                    <div className="place-order mt-25">
                      <button className="btn-hover" type="submit">
                        {t("checkout.buttons.place_order")}
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            </div>
          ) : (
            <motion.div
              className="row"
              initial={{ x: "50%" }}
              animate={{ x: "0%" }}
              exit={{ x: "50%" }}
            >
              <motion.div
                className="col-lg-12"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="item-empty-area text-center">
                  <div className="item-empty-area__icon mb-30">
                    <i className="pe-7s-cash"></i>
                  </div>
                  <div className="item-empty-area__text">
                    {t("checkout.no_items_found")} <br />{" "}
                    <Link to={"/shop"}>{t("checkout.buttons.shop_now")}</Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
      <Authenticated fallback={false}>
        <ListAddressModal
          customer={user}
          modalProps={restModalProps}
          form={form}
          close={close}
        />
      </Authenticated>
    </Fragment>
  );
};

export default CheckOut;

const getDefaultIfEmptyOrNull = (value: any, defaultValue: any): any => {
  return value !== null && value !== undefined && value !== ""
    ? value
    : defaultValue;
};

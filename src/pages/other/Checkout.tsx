import { Fragment, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDiscountPrice } from "../../helpers/product";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { RootState } from "../../redux/store";
import { NumberField, useModal } from "@refinedev/antd";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import {
  ICustomerResponse,
  IDistrict,
  IProvince,
  IVoucherResponse,
  IWard,
} from "../../interfaces";
import {
  Button,
  Form,
  Radio,
  RadioChangeEvent,
  Space,
  Spin,
  Tooltip,
} from "antd";
import Accordion from "react-bootstrap/Accordion";

import {
  Authenticated,
  useCreate,
  useCustom,
  useCustomMutation,
  useGetIdentity,
} from "@refinedev/core";
import { useNavigate } from "react-router-dom";
import { clearOrder, setOrder } from "../../redux/slices/order-slice";
import { deleteAllFromCart } from "../../redux/slices/cart-slice";
import { ContainerOutlined } from "@ant-design/icons";
import VoucherModal from "../../components/voucher/VoucherModal";
import DiscountCodeAccordion from "../../components/voucher/DiscountCodeAccordion";
import PaymentMethodAccordion from "../../components/payment-methods/PaymentMethodAccordion";
import { CurrencyFormatter } from "../../helpers/currency";

const GHN_API_BASE_URL = import.meta.env.VITE_GHN_API_BASE_URL;
const GHN_SHOP_ID = import.meta.env.VITE_GHN_SHOP_ID;
const GHN_TOKEN = import.meta.env.VITE_GHN_USER_TOKEN;

const CheckOut = () => {
  const { t } = useTranslation();

  useDocumentTitle(t("nav.pages.checkout") + " | SUNS");

  const { data: user, refetch } = useGetIdentity<ICustomerResponse>();

  console.log(user);

  const { mutate, isLoading } = useCreate();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  let { pathname } = useLocation();
  const currency = useSelector((state: RootState) => state.currency);
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const { order } = useSelector((state: RootState) => state.order);

  let cartTotalPrice = 0;
  let discount = 0;
  const shippingMoney = order.shippingMoney ?? 0;

  const [form] = Form.useForm<{
    provinceId: number;
    districtId: number;
    wardCode: string;
    line: string;
    full_name: string;
    phone_number: string;
    email: string;
    gender: string;
    date_of_birth: number;
    order_note: string;
  }>();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "Cash" | "Card"
  >("Cash");
  const [voucherCode, setVoucherCode] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVoucherCode(event.target.value);
  };

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
          errorNotification: (data, values) => {
            return {
              message: `Đã xảy ra lỗi`,
              description: "Lỗi tính tiền ship",
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
    date_of_birth: number;
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
      customer: "",
      employee: "",
      voucher: order.voucher ? order.voucher.id : "",
      phoneNumber: values.phone_number,
      fullName: values.full_name,
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
        errorNotification: false,
      },
      {
        onError: (error, variables, context) => {
          console.log("An error occurred! " + error.message);
        },
        onSuccess: (data, variables, context) => {
          dispatch(clearOrder());
          dispatch(deleteAllFromCart());

          if (selectedPaymentMethod === "Cash") {
            navigate("/success/" + data.data.id);
          } else {
            window.location.href = data.data + "";
          }
        },
      }
    );
  }

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
              >
                <div className="col-lg-7">
                  <div className="billing-info-wrap">
                    <div className="row">
                      <div className="col">
                        <h3>{t("checkout.billing_details.title")}</h3>
                      </div>
                      <div className="col text-center">
                        <Authenticated fallback={false}>
                          <Button style={{ borderRadius: 0 }}>
                            Chọn địa chỉ của bạn
                          </Button>
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
                                required: true,
                                message: "Họ và tên không được để trống!",
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
                            rules={[
                              {
                                required: true,
                                message: "Số điện thoại không được để trống!",
                              },
                            ]}
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
                                required: true,
                                message: "Email không được để trống!",
                              },
                            ]}
                          >
                            <input type="text" />
                          </Form.Item>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-select mb-20">
                          <label>{t("checkout.billing_details.gender")}</label>
                          <Form.Item
                            name="gender"
                            rules={[
                              {
                                required: true,
                                message: "Giới tính không được để trống!",
                              },
                            ]}
                          >
                            <select>
                              <option value="">--Chọn giới tính--</option>
                              <option value="Male">Nam</option>
                              <option value="Female">Nữ</option>
                              <option value="Other">Khác</option>
                            </select>
                          </Form.Item>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>
                            {t("checkout.billing_details.date_of_birth")}
                          </label>
                          <Form.Item
                            name="date_of_birth"
                            rules={[
                              {
                                required: true,
                                message: "Ngày sinh không được để trống!",
                              },
                            ]}
                          >
                            <input type="date" />
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
                                required: true,
                                message: "Tỉnh/thành phố không được để trống!",
                              },
                            ]}
                            initialValue={
                              order.address
                                ? Number(order.address.provinceId)
                                : ""
                            }
                          >
                            {provinces.length > 0 ? (
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
                                required: true,
                                message: "Quận/huyện không được để trống!",
                              },
                            ]}
                            initialValue={
                              order.address
                                ? Number(order.address.districtId)
                                : ""
                            }
                          >
                            {districts.length > 0 ? (
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
                                required: true,
                                message: "Phường/xã không được để trống!",
                              },
                            ]}
                            initialValue={
                              order.address ? order.address.wardCode : ""
                            }
                          >
                            {wards.length > 0 ? (
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
                                required: true,
                                message:
                                  "Chi tiết địa chỉ không được để trống!",
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
                        <label>
                          {t(
                            "checkout.billing_details.additional_information.order_note.title"
                          )}
                        </label>
                        <Form.Item name="order_note">
                          <textarea
                            placeholder={t(
                              "checkout.billing_details.additional_information.order_note.place_holder"
                            )}
                            name="message"
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
                              const discountedPrice = getDiscountPrice(
                                cartItem.selectedProductSize?.price ?? 0,
                                0
                              );
                              const finalProductPrice = (
                                (cartItem.selectedProductSize?.price ?? 0) *
                                currency.currencyRate
                              ).toFixed(2);
                              const finalDiscountedPrice =
                                discountedPrice !== null
                                  ? parseFloat(
                                      (
                                        discountedPrice * currency.currencyRate
                                      ).toFixed(2)
                                    )
                                  : 0.0;

                              discountedPrice !== null
                                ? (cartTotalPrice +=
                                    finalDiscountedPrice * cartItem.quantity)
                                : (cartTotalPrice +=
                                    parseFloat(finalProductPrice) *
                                    cartItem.quantity);

                              discount = order.voucher
                                ? order.voucher.type == "PERCENTAGE"
                                  ? (order.voucher.value / 100) *
                                    Number(cartTotalPrice.toFixed(2))
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
                                        : parseFloat(finalProductPrice) *
                                          cartItem.quantity
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
                              {t("checkout.your_order.shipping")}
                            </li>
                            <li>
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: currency.currencyName,
                                currencyDisplay: "symbol",
                              }).format(shippingMoney)}
                            </li>
                          </ul>
                          <ul>
                            <li className="your-order-shipping">Giảm giá</li>
                            <li>
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: currency.currencyName,
                                currencyDisplay: "symbol",
                              }).format(discount)}
                            </li>
                          </ul>
                        </div>
                        <div className="your-order-total">
                          <ul>
                            <li className="order-total">
                              {t("checkout.your_order.total_money")}
                            </li>
                            <li>
                              <NumberField
                                value={
                                  cartTotalPrice + shippingMoney - discount
                                }
                                options={{
                                  currency: currency.currencyName,
                                  style: "currency",
                                  currencyDisplay: "symbol",
                                }}
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
                      <DiscountCodeAccordion />
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
            <div className="row">
              <div className="col-lg-12">
                <div className="item-empty-area text-center">
                  <div className="item-empty-area__icon mb-30">
                    <i className="pe-7s-cash"></i>
                  </div>
                  <div className="item-empty-area__text">
                    {t("checkout.no_items_found")} <br />{" "}
                    <Link to={"/shop"}>{t("checkout.buttons.shop_now")}</Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default CheckOut;

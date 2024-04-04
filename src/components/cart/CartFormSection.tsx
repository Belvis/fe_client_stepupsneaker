import {
  Authenticated,
  useApiUrl,
  useCustom,
  useCustomMutation,
  useGetIdentity,
  useNotification,
  useTranslate,
} from "@refinedev/core";
import { Form, Select, Space, Tooltip } from "antd";
import { CurrencyFormatter, formatCurrency } from "../../helpers/currency";
import { CurrencyState } from "../../redux/slices/currency-slice";
import { useEffect, useState } from "react";
import {
  ICustomerResponse,
  IDistrict,
  IOrderRequest,
  IProvince,
  IVoucherList,
  IVoucherResponse,
  IWard,
} from "../../interfaces";
import { clearVoucher, setOrder } from "../../redux/slices/order-slice";
import { AppDispatch } from "../../redux/store";
import { useDispatch } from "react-redux";
import { validateCommon } from "../../helpers/validate";
import {
  ContainerOutlined,
  GiftOutlined,
  LoadingOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { showErrorToast } from "../../helpers/toast";
import { dataProvider } from "../../providers/dataProvider";
import { FREE_SHIPPING_THRESHOLD } from "../../constants";
import { DiscountMessage, DiscountMoney } from "../../styled/CartStyled";
import { Link } from "react-router-dom";
import { useModal } from "@refinedev/antd";
import VoucherModal from "../voucher/VoucherModal";

const GHN_API_BASE_URL = import.meta.env.VITE_GHN_API_BASE_URL;
const GHN_SHOP_ID = import.meta.env.VITE_GHN_SHOP_ID;
const GHN_TOKEN = import.meta.env.VITE_GHN_USER_TOKEN;

type CartFormSectionProps = {
  currency: CurrencyState;
  order: IOrderRequest;
  cartTotalPrice: number;
  discount: number;
};

const CartFormSection: React.FC<CartFormSectionProps> = ({
  currency,
  order,
  discount,
  cartTotalPrice,
}) => {
  const t = useTranslate();
  const { open } = useNotification();
  const { data: user } = useGetIdentity<ICustomerResponse>();
  const dispatch: AppDispatch = useDispatch();
  const API_URL = useApiUrl();
  const { getOne } = dataProvider(API_URL);

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

  const [voucherCode, setVoucherCode] = useState("");
  const [shippingMoney, setShippingMoney] = useState(order.shippingMoney ?? 0);
  const [legitVouchers, setLegitVouchers] = useState<IVoucherList[]>([]);

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
    if (cartTotalPrice >= FREE_SHIPPING_THRESHOLD) setShippingMoney(0);
  }, [cartTotalPrice]);

  const {
    show,
    close,
    modalProps: { visible, ...restModalProps },
  } = useModal();

  const handleProvinceChange = (value: number, option: any) => {
    setProvinceName(option.label);
    form.setFieldValue("districtId", null);
    form.setFieldValue("wardCode", null);
  };

  const handleDistrictChange = (value: number, option: any) => {
    setDistrictName(option.label);
  };

  const handleWardChange = (value: string, option: any) => {
    setWardName(option.label);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    try {
      event.preventDefault();

      if (!voucherCode.trim()) {
        showErrorToast(t("cart.voucher.messages.empty"));
        return;
      }

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
          message: t("cart.voucher.messages.success"),
          description: t("common.success"),
        });
      } else {
        open?.({
          type: "error",
          message: t("cart.voucher.messages.invalid"),
          description: t("common.fail"),
        });
      }
    } catch (error: any) {
      open?.({
        type: "error",
        message: t("common.error") + error.message,
        description: "Oops...",
      });
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVoucherCode(event.target.value);
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
            message: t("cart.shipping.messages.calculateFee") + shippingMoney,
            description: t("common.success"),
            type: "success",
          };
        },
        errorNotification: (data, values) => {
          const shippingMoney = formatCurrency(36500 ?? 0, currency);

          return {
            message: t("cart.shipping.messages.calculateFee") + shippingMoney,
            description: t("common.success"),
            type: "success",
          };
        },
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
          const shippingMoney = data?.response.data.total as number;
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

  return (
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
              className="shipping-address-form mt-2"
              form={form}
              name="shipping-address"
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
            >
              <div className="tax-select-wrapper">
                <Form.Item
                  label={t(`cart.shipping.address.province.title`)}
                  name="provinceId"
                  rules={[
                    {
                      validator: (_, value) =>
                        validateCommon(_, value, t, "provinceId"),
                    },
                  ]}
                  initialValue={
                    order.address ? Number(order.address.provinceId) : ""
                  }
                >
                  <Select
                    className="email s-email s-wid"
                    showSearch
                    placeholder={t(
                      "cart.shipping.address.province.place_holder"
                    )}
                    loading={isLoadingProvince}
                    onChange={handleProvinceChange}
                    filterOption={filterOption}
                    options={
                      provinces &&
                      provinces.map((province) => ({
                        label: province.ProvinceName,
                        value: province.ProvinceID,
                      }))
                    }
                  />
                </Form.Item>
                <Form.Item
                  label={t(`cart.shipping.address.district.title`)}
                  name="districtId"
                  rules={[
                    {
                      validator: (_, value) =>
                        validateCommon(_, value, t, "districtId"),
                    },
                  ]}
                  initialValue={
                    order.address ? Number(order.address.districtId) : ""
                  }
                >
                  <Select
                    className="email s-email s-wid"
                    showSearch
                    placeholder={t(
                      "cart.shipping.address.district.place_holder"
                    )}
                    loading={isLoadingDistrict}
                    onChange={handleDistrictChange}
                    filterOption={filterOption}
                    options={
                      districts &&
                      districts.map((district) => ({
                        label: district.DistrictName,
                        value: district.DistrictID,
                      }))
                    }
                  />
                </Form.Item>
                <Form.Item
                  label={t(`cart.shipping.address.ward.title`)}
                  name="wardCode"
                  rules={[
                    {
                      validator: (_, value) =>
                        validateCommon(_, value, t, "wardCode"),
                    },
                  ]}
                  initialValue={order.address ? order.address.wardCode : ""}
                >
                  <Select
                    className="email s-email s-wid"
                    showSearch
                    placeholder={t("cart.shipping.address.ward.place_holder")}
                    loading={isLoadingWard}
                    onChange={handleWardChange}
                    filterOption={filterOption}
                    options={
                      wards &&
                      wards.map((ward) => ({
                        label: ward.WardName,
                        value: ward.WardCode,
                      }))
                    }
                  />
                </Form.Item>
                <button className="cart-btn-2 mt-2" disabled={isLoadingFee}>
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

      <Authenticated key="cart-voucher" fallback={false}>
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
                  name="voucher_code"
                  value={voucherCode}
                  onChange={handleChange}
                />
                <Space>
                  <button className="cart-btn-2" type="submit">
                    {t(`cart.buttons.apply_voucher`)}
                  </button>
                  <Tooltip title={t("cart.buttons.check_voucher")}>
                    <button className="cart-btn-3" type="button" onClick={show}>
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
            <CurrencyFormatter value={cartTotalPrice} currency={currency} />
          </h5>
          <h5>
            {t(`cart.cart_total.shipping`)}{" "}
            {cartTotalPrice >= FREE_SHIPPING_THRESHOLD ? (
              <span className="free-shipping">{t("common.free_shipping")}</span>
            ) : (
              <>
                {order.address ? (
                  <CurrencyFormatter
                    value={shippingMoney}
                    currency={currency}
                  />
                ) : (
                  <span className="free-shipping">
                    {t("cart.shipping.address.messages.empty")}
                  </span>
                )}
              </>
            )}
          </h5>
          <h5>
            <span className="remove-voucher">
              {t("cart.voucher.voucher")}{" "}
              {order.voucher && (
                <MinusCircleOutlined
                  className="remove-voucher"
                  onClick={() => dispatch(clearVoucher())}
                />
              )}
            </span>{" "}
            <CurrencyFormatter value={discount} currency={currency} />
          </h5>
          <h4 className="grand-total-title">
            {t(`cart.cart_total.grand_total`)}{" "}
            <CurrencyFormatter
              value={
                Math.max(cartTotalPrice - discount, 0) +
                (cartTotalPrice < FREE_SHIPPING_THRESHOLD ? shippingMoney : 0)
              }
              currency={currency}
            />
          </h4>
          <hr />
          <div>
            {(() => {
              const freeShippingDifference =
                cartTotalPrice < FREE_SHIPPING_THRESHOLD
                  ? FREE_SHIPPING_THRESHOLD - cartTotalPrice
                  : Infinity;

              const voucherDifference =
                legitVouchers && legitVouchers.length > 0
                  ? cartTotalPrice < legitVouchers[0].voucher.constraint
                    ? legitVouchers[0].voucher.constraint - cartTotalPrice
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
                  <DiscountMessage className="message">
                    <GiftOutlined /> {t("cart.messages.buy_more")}{" "}
                    <DiscountMoney>
                      {formatCurrency(freeShippingDifference, currency)}
                    </DiscountMoney>{" "}
                    {t("cart.messages.for_free_shipping")}
                  </DiscountMessage>
                );
              } else if (shouldDisplayVoucher) {
                return (
                  <DiscountMessage className="message">
                    <GiftOutlined /> {t("cart.messages.buy_more")}{" "}
                    <DiscountMoney>
                      {formatCurrency(voucherDifference, currency)}
                    </DiscountMoney>{" "}
                    {t("cart.messages.for_discount")}{" "}
                    <DiscountMoney>
                      {formatCurrency(legitVouchers[0].voucher.value, currency)}
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

      <Authenticated key="cart-voucher-modal" fallback={false}>
        {restModalProps.open && (
          <VoucherModal
            restModalProps={restModalProps}
            vouchers={user?.customerVoucherList || []}
            type="apply"
            close={close}
          />
        )}
      </Authenticated>
    </div>
  );
};

export default CartFormSection;

const filterOption = (
  input: string,
  option?: { label: string; value: number | string }
) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

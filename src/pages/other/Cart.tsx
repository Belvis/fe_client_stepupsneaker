import { ChangeEvent, Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { getDiscountPrice } from "../../helpers/product";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { cartItemStock } from "../../helpers/product";
import {
  addToCart,
  decreaseQuantity,
  deleteFromCart,
  deleteAllFromCart,
} from "../../redux/slices/cart-slice";
import { RootState } from "../../redux/store";
import { NumberField, useModal } from "@refinedev/antd";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import {
  IDistrict,
  IProvince,
  IVoucherResponse,
  IWard,
} from "../../interfaces";
import {
  Button,
  Form,
  Select,
  Space,
  Tooltip,
  List as AntdList,
  Modal,
} from "antd";
import {
  HttpError,
  useApiUrl,
  useCustom,
  useCustomMutation,
  useList,
} from "@refinedev/core";
import { setOrder } from "../../redux/slices/order-slice";
import { ContainerOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { dataProvider } from "../../api/dataProvider";

const GHN_API_BASE_URL = import.meta.env.VITE_GHN_API_BASE_URL;
const GHN_SHOP_ID = import.meta.env.VITE_GHN_SHOP_ID;
const GHN_TOKEN = import.meta.env.VITE_GHN_USER_TOKEN;

const Cart = () => {
  const { t } = useTranslation();

  const API_URL = useApiUrl();
  const { getOne } = dataProvider(API_URL);

  useDocumentTitle(t("nav.pages.cart") + " | SUNS");
  const { mutate: calculateFeeMutate } = useCustomMutation<any>();

  let cartTotalPrice = 0;

  const [quantityCount] = useState(1);
  const dispatch = useDispatch();
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

  const { data, isLoading, isError } = useList<IVoucherResponse, HttpError>({
    resource: "vouchers",
    pagination: {
      pageSize: 1000,
    },
  });

  const vouchers = data?.data ? data?.data : [];

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
          const shippingMoney = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency.currencyName,
            currencyDisplay: "symbol",
          }).format(data?.response.data.total ?? 0);
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
              shippingMoney: data?.response.data.total as number,
            })
          );
        },
      }
    );
  }

  const { show, close, modalProps } = useModal();

  function renderItem(item: IVoucherResponse) {
    const { id, code, value, constraint, image, endDate, quantity, type } =
      item;

    const constraintPrice = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.currencyName,
      currencyDisplay: "symbol",
    }).format(constraint);
    const cashPrice =
      type === "CASH"
        ? new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency.currencyName,
            currencyDisplay: "symbol",
          }).format(value)
        : 0;
    return (
      <AntdList.Item actions={[]}>
        <AntdList.Item.Meta title={""} description={""} />
        <div className="coupon-container">
          <div className="coupon-card">
            <img src={image} className="logo" />
            {type === "PERCENTAGE" ? (
              <h3>
                Giảm giá {value}% cho đơn hàng trên {constraintPrice}
                <br />
                Nhân ngày t1 vô địch
              </h3>
            ) : (
              <h3>
                Giảm giá {cashPrice} cho đơn hàng trên {constraintPrice}
                <br />
                Nhân ngày t1 vô địch
              </h3>
            )}
            <div className="coupon-row">
              <span id="cpnCode">{code}</span>
              <span id="cpnBtn">Copy Code</span>
            </div>
            <p>Có hạn tới: {dayjs(new Date(endDate)).format("lll")}</p>
            <div className="circle1"></div>
            <div className="circle2"></div>
          </div>
        </div>
      </AntdList.Item>
    );
  }

  const [voucherCode, setVoucherCode] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { data } = await getOne({ resource: "vouchers", id: voucherCode });

    const voucher = (data as IVoucherResponse) ?? ({} as IVoucherResponse);

    if (voucher)
      dispatch(
        setOrder({
          ...order,
          voucher: voucher,
        })
      );
    console.log(data);
    console.log(voucher);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVoucherCode(event.target.value);
  };

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

                          return (
                            <tr key={key}>
                              <td className="product-thumbnail">
                                <Link to={"/product/" + cartItem.id}>
                                  <img
                                    className="img-fluid"
                                    src={cartItem.image}
                                    alt=""
                                  />
                                </Link>
                              </td>

                              <td className="product-name">
                                <Link to={"/product/" + cartItem.id}>
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
                                    <span className="amount old">
                                      <NumberField
                                        value={finalProductPrice}
                                        options={{
                                          currency: currency.currencyName,
                                          style: "currency",
                                          currencyDisplay: "symbol",
                                        }}
                                      />
                                    </span>
                                    <span className="amount">
                                      <NumberField
                                        value={finalDiscountedPrice}
                                        options={{
                                          currency: currency.currencyName,
                                          style: "currency",
                                          currencyDisplay: "symbol",
                                        }}
                                      />
                                    </span>
                                  </Fragment>
                                ) : (
                                  <span className="amount">
                                    <NumberField
                                      value={finalProductPrice}
                                      options={{
                                        currency: currency.currencyName,
                                        style: "currency",
                                        currencyDisplay: "symbol",
                                      }}
                                    />
                                  </span>
                                )}
                              </td>

                              <td className="product-quantity">
                                <div className="cart-plus-minus">
                                  <button
                                    className="dec qtybutton"
                                    onClick={() =>
                                      dispatch(decreaseQuantity(cartItem))
                                    }
                                  >
                                    -
                                  </button>
                                  <input
                                    className="cart-plus-minus-box"
                                    type="text"
                                    value={cartItem.quantity}
                                    readOnly
                                  />
                                  <button
                                    className="inc qtybutton"
                                    onClick={() =>
                                      dispatch(
                                        addToCart({
                                          ...cartItem,
                                          quantity: quantityCount,
                                        })
                                      )
                                    }
                                    disabled={
                                      cartItem !== undefined &&
                                      cartItem.quantity !== undefined &&
                                      cartItem.quantity >=
                                        cartItemStock(
                                          cartItem.selectedProductSize
                                        )
                                    }
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                              <td className="product-subtotal">
                                <NumberField
                                  value={
                                    discountedPrice !== null
                                      ? finalDiscountedPrice * cartItem.quantity
                                      : parseFloat(finalProductPrice) *
                                        cartItem.quantity
                                  }
                                  options={{
                                    currency: currency.currencyName,
                                    style: "currency",
                                    currencyDisplay: "symbol",
                                  }}
                                />
                              </td>

                              <td className="product-remove">
                                <button
                                  onClick={() =>
                                    dispatch(deleteFromCart(cartItem.id))
                                  }
                                >
                                  <i className="fa fa-times"></i>
                                </button>
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
                      <button onClick={() => dispatch(deleteAllFromCart())}>
                        {t(`cart.buttons.clear_cart`)}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
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
                          <button className="cart-btn-2">
                            {t(`cart.buttons.get_a_quote`)}
                          </button>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>

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
                              type="submit"
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

                <div className="col-lg-4 col-md-12">
                  <div className="grand-totall">
                    <div className="title-wrap">
                      <h4 className="cart-bottom-title section-bg-gary-cart">
                        {t(`cart.cart_total.title`)}
                      </h4>
                    </div>
                    <h5>
                      {t(`cart.cart_total.total`)}{" "}
                      <span>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: currency.currencyName,
                          currencyDisplay: "symbol",
                        }).format(Number(cartTotalPrice.toFixed(2)))}
                      </span>
                    </h5>
                    <h5>
                      {t(`cart.cart_total.shipping`)}{" "}
                      <span>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: currency.currencyName,
                          currencyDisplay: "symbol",
                        }).format(order.shippingMoney ?? 0)}
                      </span>
                    </h5>
                    <h5>
                      {"Giảm giá"}{" "}
                      <span>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: currency.currencyName,
                          currencyDisplay: "symbol",
                        }).format(
                          order.voucher
                            ? order.voucher.type == "PERCENTAGE"
                              ? (order.voucher.value / 100) *
                                Number(cartTotalPrice.toFixed(2))
                              : order.voucher.value
                            : 0
                        )}
                      </span>
                    </h5>

                    <h4 className="grand-totall-title">
                      {t(`cart.cart_total.grand_total`)}{" "}
                      <span>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: currency.currencyName,
                          currencyDisplay: "symbol",
                        }).format(Number(cartTotalPrice.toFixed(2)))}
                      </span>
                    </h4>
                    <Link to={"/checkout"}>
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
      <Modal title="Voucher" {...modalProps} width="1000px">
        <AntdList
          bordered
          itemLayout="horizontal"
          dataSource={vouchers}
          renderItem={renderItem}
          loading={isLoading}
        />
      </Modal>
    </Fragment>
  );
};

export default Cart;

const filterOption = (
  input: string,
  option?: { label: string; value: number }
) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

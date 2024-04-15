import {
  CaretDownOutlined,
  CaretUpOutlined,
  GiftOutlined,
  InfoCircleOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { useModal } from "@refinedev/antd";
import {
  Authenticated,
  useCustom,
  useCustomMutation,
  useGetIdentity,
  useTranslate,
  useUpdate,
} from "@refinedev/core";
import {
  Badge,
  Button,
  Form,
  Input,
  Modal,
  ModalProps,
  Select,
  Space,
  Tooltip,
  Typography,
} from "antd";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FREE_SHIPPING_THRESHOLD } from "../../constants";
import { showWarningConfirmDialog } from "../../helpers/confirm";
import { CurrencyFormatter, formatCurrency } from "../../helpers/currency";
import { showErrorToast } from "../../helpers/toast";
import {
  validateCommon,
  validateEmail,
  validateFullName,
  validatePhoneNumber,
} from "../../helpers/validate";
import {
  ICustomerResponse,
  IDistrict,
  IOrderDetailResponse,
  IOrderRequest,
  IOrderResponse,
  IProvince,
  IVoucherList,
  IWard,
} from "../../interfaces";
import { RootState } from "../../redux/store";
import { DiscountMessage, DiscountMoney } from "../../styled/CartStyled";
import { ListAddressModal } from "../address/ListAddressModal";
import VoucherModal from "../voucher/VoucherModal";
import { AdvancedAddModal } from "./advanced-add/AdvancedAddModal";

const { Text } = Typography;

const GHN_API_BASE_URL = import.meta.env.VITE_GHN_API_BASE_URL;
const GHN_SHOP_ID = import.meta.env.VITE_GHN_SHOP_ID;
const GHN_TOKEN = import.meta.env.VITE_GHN_USER_TOKEN;

interface MyOrderModalProps {
  restModalProps: ModalProps;
  order: IOrderResponse;
  callBack: any;
  close: () => void;
  showCancel: () => void;
}

const { Title } = Typography;

const MyOrderModal: React.FC<MyOrderModalProps> = ({
  restModalProps,
  order,
  callBack,
  close,
  showCancel,
}) => {
  const t = useTranslate();

  const currency = useSelector((state: RootState) => state.currency);

  const { mutate: update, isLoading: isLoadingUpdate } = useUpdate();

  const [form] = Form.useForm<{
    districtId: number;
    districtName: string;
    wardCode: string;
    wardName: string;
    provinceId: number;
    provinceName: string;
    line: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    orderNote: string;
  }>();

  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [wards, setWards] = useState<IWard[]>([]);
  const provinceId = Form.useWatch("provinceId", form);
  const districtId = Form.useWatch("districtId", form);
  const wardCode = Form.useWatch("wardCode", form);
  const [provinceName, setProvinceName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [wardName, setWardName] = useState("");

  const [viewOrder, setViewOrder] = useState<IOrderResponse>(order);

  const [shippingMoney, setShippingMoney] = useState<number>(0);

  const {
    show: advancedAddShow,
    close: advancedAddClose,
    modalProps: advancedAddModalProps,
  } = useModal();

  const { data: user, refetch } = useGetIdentity<ICustomerResponse>();

  const [legitVouchers, setLegitVouchers] = useState<IVoucherList[]>([]);

  // Reset on open

  useEffect(() => {
    if (order && restModalProps.open) {
      setViewOrder(_.cloneDeep(order));
      form.setFieldsValue({
        districtId: Number(order.address?.districtId),
        districtName: order.address?.districtName,
        wardCode: order.address?.wardCode,
        wardName: order.address?.wardName,
        provinceId: Number(order.address?.provinceId),
        provinceName: order.address?.provinceName,
        line: order.address?.more,
        fullName: order.fullName,
        phoneNumber: order.phoneNumber,
        email: order.email,
        orderNote: order.note,
      });
    }
  }, [order, restModalProps]);

  // Update money

  useEffect(() => {
    if (viewOrder.orderDetails) {
      const newOriginMoney = viewOrder.orderDetails.reduce(
        (accumulator, detail) => accumulator + detail.totalPrice,
        0
      );
      const newShippingMoney =
        newOriginMoney < FREE_SHIPPING_THRESHOLD
          ? shippingMoney === 0
            ? viewOrder.shippingMoney
            : shippingMoney
          : 0;

      setViewOrder((prev) => ({
        ...prev,
        originMoney: newOriginMoney,
        shippingMoney: newShippingMoney,
        totalMoney: newOriginMoney + newShippingMoney - prev.reduceMoney,
      }));
    }
  }, [viewOrder.orderDetails]);

  useEffect(() => {
    if (viewOrder.voucher) {
      if (viewOrder.voucher !== order.voucher) {
        const newReduceMoney =
          viewOrder.voucher.type === "PERCENTAGE"
            ? (viewOrder.voucher.value * viewOrder.originMoney) / 100
            : viewOrder.voucher.value;
        const newTotalMoney =
          viewOrder.originMoney + viewOrder.shippingMoney - newReduceMoney;
        setViewOrder((prev) => ({
          ...prev,
          reduceMoney: newReduceMoney,
          totalMoney: newTotalMoney,
        }));
      }
    } else {
      const newReduceMoney = 0;
      const newTotalMoney =
        viewOrder.originMoney + viewOrder.shippingMoney - newReduceMoney;

      setViewOrder((prev) => ({
        ...prev,
        reduceMoney: newReduceMoney,
        totalMoney: newTotalMoney,
      }));
    }
  }, [viewOrder.voucher]);
  // Convert vouchers list

  useEffect(() => {
    if (user && user.customerVoucherList && viewOrder.originMoney) {
      const convertedLegitVoucher = _.cloneDeep(user.customerVoucherList);
      convertedLegitVoucher.map((single) => {
        const updatedVoucher = { ...single };
        if (single.voucher.type === "PERCENTAGE") {
          updatedVoucher.voucher.value =
            (single.voucher.value * viewOrder.originMoney) / 100;
        }
        return updatedVoucher;
      });

      convertedLegitVoucher.sort((a, b) => b.voucher.value - a.voucher.value);
      setLegitVouchers(convertedLegitVoucher);
    }
  }, [user, viewOrder.originMoney]);

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
          errorNotification: false,
        },
        {
          onError: (error, variables, context) => {
            console.log("An error occurred! ", +error);

            const shippingMoney = 36500;
            setShippingMoney(shippingMoney);
          },
          onSuccess: (data: any, variables, context) => {
            const shippingMoney = data?.response.data.total as number;

            setShippingMoney(shippingMoney);
          },
        }
      );
    }
  }, [provinceId, districtId, wardCode]);

  const handleProvinceChange = (value: number, option: any) => {
    setProvinceName(option.label);
    form.setFieldValue("districtId", null);
    form.setFieldValue("wardCode", "");
  };

  const handleDistrictChange = (value: number, option: any) => {
    setDistrictName(option.label);
  };

  const handleWardChange = (value: string, option: any) => {
    setWardName(option.label);
  };

  const handleUpdateOrder = () => {
    const simplifiedCartItems: { id: string; quantity: number }[] =
      viewOrder.orderDetails.map((item) => {
        return {
          id: item.id,
          productDetailId: item.productDetail.id,
          quantity: item.quantity,
        };
      });
    const submitData = {
      fullName: form.getFieldValue("fullName"),
      email: form.getFieldValue("email"),
      phoneNumber: form.getFieldValue("phoneNumber"),
      note: form.getFieldValue("orderNote"),
      addressShipping: {
        phoneNumber: form.getFieldValue("phoneNumber"),
        districtId: form.getFieldValue("districtId"),
        districtName: districtName,
        provinceId: form.getFieldValue("provinceId"),
        provinceName: provinceName,
        wardCode: form.getFieldValue("wardCode"),
        wardName: wardName,
        more: form.getFieldValue("line"),
      },
      cartItems: simplifiedCartItems,
      voucher: viewOrder.voucher !== null ? viewOrder.voucher?.id : null,
    };

    update(
      {
        resource: `orders`,
        values: submitData,
        id: viewOrder.id,
        successNotification(data, values, resource) {
          return {
            message: t("common.update.success"),
            description: t("common.success"),
            type: "success",
          };
        },
        errorNotification: (error: any) => {
          return {
            message: t("common.error") + error?.message,
            description: "Oops...",
            type: "error",
          };
        },
      },
      {
        onError: (error, variables, context) => {},
        onSuccess: (data, variables, context) => {
          callBack();
          close();
        },
      }
    );
  };
  const handleOk = () => {
    showWarningConfirmDialog({
      options: {
        accept: () => handleUpdateOrder(),
        reject: () => {},
      },
      t: t,
    });
  };

  const showBadgeShipping = viewOrder.originMoney < FREE_SHIPPING_THRESHOLD;
  const showCaretUpShipping = viewOrder.shippingMoney > order.shippingMoney;
  const showCaretDownShipping = viewOrder.shippingMoney < order.shippingMoney;

  const showBadgeGrandTotal = viewOrder.totalMoney !== order.totalMoney;
  const showCaretUpGrandTotal = viewOrder.totalMoney > order.totalMoney;
  const showCaretDownGrandTotal = viewOrder.totalMoney < order.totalMoney;

  const showBadgeCartTotal = viewOrder.originMoney !== order.originMoney;
  const showCaretUpCartTotal = viewOrder.originMoney > order.originMoney;
  const showCaretDownCartTotal = viewOrder.originMoney < order.originMoney;

  const shippingBadgeCount =
    showBadgeShipping && showCaretUpShipping ? (
      <CaretUpOutlined style={{ color: "red" }} />
    ) : showBadgeShipping && showCaretDownShipping ? (
      <CaretDownOutlined style={{ color: "green" }} />
    ) : (
      0
    );

  const grandTotalBadgeCount =
    showBadgeGrandTotal && showCaretUpGrandTotal ? (
      <CaretUpOutlined style={{ color: "red" }} />
    ) : showBadgeGrandTotal && showCaretDownGrandTotal ? (
      <CaretDownOutlined style={{ color: "green" }} />
    ) : (
      0
    );

  const cartTotalBadgeCount =
    showBadgeCartTotal && showCaretUpCartTotal ? (
      <CaretUpOutlined style={{ color: "red" }} />
    ) : showBadgeCartTotal && showCaretDownCartTotal ? (
      <CaretDownOutlined style={{ color: "green" }} />
    ) : (
      0
    );

  const {
    show,
    close: voucherClose,
    modalProps: { visible, ...restVoucherModalProps },
  } = useModal();

  const {
    show: showAddress,
    close: closeAddress,
    modalProps: { visible: addressVisible, ...restAddressModalProps },
  } = useModal();

  const setAddresses = (order: IOrderRequest) => {
    form.setFieldsValue({
      districtId: Number(order.address?.districtId),
      districtName: order.address?.districtName,
      wardCode: order.address?.wardCode,
      wardName: order.address?.wardName,
      provinceId: Number(order.address?.provinceId),
      provinceName: order.address?.provinceName,
      line: order.address?.more,
      phoneNumber: order.phoneNumber,
    });
  };

  return (
    <Modal
      title={
        <Space align="baseline">
          <Title level={5}>{t("order_tracking.modal.title")}</Title>
          <Tooltip title={t("order_tracking.modal.tooltip")}>
            <InfoCircleOutlined />
          </Tooltip>
          <Button type="primary" onClick={advancedAddShow}>
            {t("products.titles.add")}
          </Button>
        </Space>
      }
      {...restModalProps}
      open={restModalProps.open}
      width="1200px"
      centered
      okText={t("buttons.save_changes")}
      onOk={handleOk}
    >
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
                {viewOrder?.orderDetails?.map((single, key) => {
                  return (
                    <tr key={key}>
                      <td className="product-thumbnail">
                        <Link
                          to={"/product/" + single.productDetail.product.id}
                        >
                          <img
                            className="img-fluid"
                            src={single.productDetail.image}
                            alt=""
                          />
                        </Link>
                      </td>

                      <td className="product-name">
                        <Link
                          to={"/product/" + single.productDetail.product.id}
                        >
                          {single.productDetail.product.name}
                        </Link>
                        <div className="cart-item-variation">
                          <span>
                            {t(`cart.table.head.color`)}:{" "}
                            {single.productDetail.color.name}
                          </span>
                          <span>
                            {t(`cart.table.head.size`)}:{" "}
                            {single.productDetail.size.name}
                          </span>
                        </div>
                      </td>

                      <td className="product-price-cart">
                        <CurrencyFormatter
                          className="amount"
                          value={single.price * currency.currencyRate}
                          currency={currency}
                        />
                      </td>

                      <td className="product-quantity">
                        <div className="cart-plus-minus">
                          <button
                            className="dec qtybutton"
                            onClick={() => {
                              const cartCount = viewOrder.orderDetails.length;

                              if (single.quantity > 1) {
                                setViewOrder((prev) => ({
                                  ...prev,
                                  orderDetails: prev.orderDetails.map(
                                    (detail) => {
                                      if (detail.id === single.id) {
                                        const newQuantity = detail.quantity - 1;

                                        return {
                                          ...detail,
                                          quantity: newQuantity,
                                          totalPrice:
                                            detail.price * newQuantity,
                                        };
                                      } else {
                                        return detail;
                                      }
                                    }
                                  ),
                                }));
                              } else {
                                if (cartCount === 1) {
                                  showWarningConfirmDialog({
                                    options: {
                                      message: t(
                                        "cart.messages.zero_qty_cart_warn"
                                      ),
                                      accept: () => {
                                        close();
                                        showCancel();
                                      },
                                      reject: () => {},
                                    },
                                    t: t,
                                  });
                                } else {
                                  showWarningConfirmDialog({
                                    options: {
                                      message: t("cart.messages.zero_qty_warn"),
                                      accept: () => {
                                        setViewOrder((prev) => ({
                                          ...prev,
                                          orderDetails:
                                            prev.orderDetails.filter(
                                              (detail) =>
                                                detail.id !== single.id
                                            ),
                                        }));
                                      },
                                      reject: () => {},
                                    },
                                    t: t,
                                  });
                                }
                              }
                            }}
                          >
                            -
                          </button>

                          <input
                            className="cart-plus-minus-box"
                            type="text"
                            value={single.quantity}
                            onChange={(e) => {
                              const newValue = parseInt(e.target.value, 10);

                              if (isNaN(newValue) || newValue <= 0) {
                                return;
                              }

                              if (
                                calculateTotalQuantity(viewOrder) +
                                  (newValue - single.quantity) >
                                5
                              ) {
                                showErrorToast(
                                  t("products.messages.max_cart_size")
                                );
                                return;
                              }

                              if (
                                newValue > single.productDetail.quantity ||
                                newValue > 5
                              ) {
                                showErrorToast(
                                  t("products.messages.limit_reached")
                                );
                                return;
                              }

                              // Cập nhật số lượng và tổng giá trị cho chi tiết đơn hàng
                              setViewOrder((prev) => ({
                                ...prev,
                                orderDetails: prev.orderDetails.map(
                                  (detail) => {
                                    if (detail.id === single.id) {
                                      return {
                                        ...detail,
                                        quantity: newValue,
                                        totalPrice: detail.price * newValue,
                                      };
                                    } else {
                                      return detail;
                                    }
                                  }
                                ),
                              }));
                            }}
                          />
                          <button
                            className="inc qtybutton"
                            onClick={() => {
                              if (calculateTotalQuantity(viewOrder) >= 5) {
                                return showErrorToast(
                                  t("products.messages.max_cart_size")
                                );
                              }

                              if (
                                single.quantity >= single.productDetail.quantity
                              ) {
                                return showErrorToast(
                                  t("products.messages.limit_reached")
                                );
                              }

                              if (single.quantity >= 5) {
                                return showErrorToast(
                                  t("products.messages.max_cart_size")
                                );
                              }
                              setViewOrder((prev) => ({
                                ...prev,
                                orderDetails: prev.orderDetails.map(
                                  (detail) => {
                                    if (detail.id === single.id) {
                                      const newQuantity = detail.quantity + 1;

                                      return {
                                        ...detail,
                                        quantity: newQuantity,
                                        totalPrice: detail.price * newQuantity,
                                      };
                                    } else {
                                      return detail;
                                    }
                                  }
                                ),
                              }));
                            }}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="product-subtotal">
                        <CurrencyFormatter
                          className="amount"
                          value={single.totalPrice * currency.currencyRate}
                          currency={currency}
                        />
                      </td>

                      <td className="product-remove">
                        <button
                          onClick={() => {
                            const cartCount = viewOrder.orderDetails.length;
                            if (cartCount == 1) {
                              showWarningConfirmDialog({
                                options: {
                                  message: t(
                                    "cart.messages.zero_qty_cart_warn"
                                  ),
                                  accept: () => {
                                    close();
                                    showCancel();
                                  },
                                  reject: () => {},
                                },
                                t: t,
                              });
                            } else {
                              showWarningConfirmDialog({
                                options: {
                                  accept: () => {
                                    setViewOrder((prev) => ({
                                      ...prev,
                                      orderDetails: prev.orderDetails.filter(
                                        (detail) => detail.id !== single.id
                                      ),
                                    }));
                                  },
                                  reject: () => {},
                                },
                                t: t,
                              });
                            }
                          }}
                        >
                          <i className="fa fa-times"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan={6} style={{ textAlign: "end" }}>
                    <div className="row">
                      <div className="col-9">
                        <Badge count={cartTotalBadgeCount}>
                          <h5>{t(`cart.cart_total.total`)} </h5>
                        </Badge>
                      </div>
                      <div className="col-3">
                        <CurrencyFormatter
                          className="amount"
                          value={viewOrder.originMoney * currency.currencyRate}
                          currency={currency}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-9">
                        <Badge count={shippingBadgeCount}>
                          <h5>{t(`cart.cart_total.shipping`)} </h5>
                        </Badge>
                      </div>
                      <div className="col-3">
                        {showBadgeShipping ? (
                          <CurrencyFormatter
                            className="amount"
                            value={
                              viewOrder.shippingMoney * currency.currencyRate
                            }
                            currency={currency}
                          />
                        ) : (
                          <span className="free-shipping">
                            {t("common.free_shipping")}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-9">
                        <Authenticated
                          key="discount"
                          fallback={
                            <Tooltip title={t("cart.voucher.messages.author")}>
                              <h5>{t("cart.voucher.voucher")}</h5>
                            </Tooltip>
                          }
                        >
                          <h5>
                            {viewOrder.voucher ? (
                              <Tooltip title={t("cart.voucher.remove")}>
                                <MinusCircleOutlined
                                  className="remove-voucher"
                                  onClick={() => {
                                    showWarningConfirmDialog({
                                      options: {
                                        accept: () => {
                                          setViewOrder((prev) => {
                                            const { voucher, ...rest } = prev;
                                            return rest;
                                          });
                                        },
                                        reject: () => {},
                                      },
                                      t: t,
                                    });
                                  }}
                                />
                              </Tooltip>
                            ) : (
                              <Tooltip title={t("cart.voucher.add")}>
                                <PlusCircleOutlined
                                  className="add-voucher"
                                  onClick={show}
                                />
                              </Tooltip>
                            )}{" "}
                            {t("cart.voucher.voucher")}
                          </h5>
                        </Authenticated>
                      </div>
                      <div className="col-3">
                        <CurrencyFormatter
                          className="amount"
                          value={viewOrder.reduceMoney * currency.currencyRate}
                          currency={currency}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-9">
                        <Badge count={grandTotalBadgeCount}>
                          <h4 className="grand-total-title">
                            {t(`cart.cart_total.grand_total`)}{" "}
                          </h4>
                        </Badge>
                      </div>
                      <div className="col-3">
                        <CurrencyFormatter
                          className="amount"
                          value={viewOrder.totalMoney * currency.currencyRate}
                          currency={currency}
                        />
                      </div>
                    </div>
                    <div className="row">
                      {(() => {
                        const freeShippingDifference =
                          viewOrder.originMoney < FREE_SHIPPING_THRESHOLD
                            ? FREE_SHIPPING_THRESHOLD - viewOrder.originMoney
                            : Infinity;

                        const voucherDifference =
                          legitVouchers && legitVouchers.length > 0
                            ? viewOrder.originMoney <
                              legitVouchers[0].voucher.constraint
                              ? legitVouchers[0].voucher.constraint -
                                viewOrder.originMoney
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
                              <GiftOutlined /> {t("cart.messages.buy_more")}{" "}
                              <DiscountMoney>
                                {formatCurrency(
                                  freeShippingDifference,
                                  currency
                                )}
                              </DiscountMoney>{" "}
                              {t("cart.messages.for_free_shipping")}
                            </DiscountMessage>
                          );
                        } else if (shouldDisplayVoucher) {
                          return (
                            <DiscountMessage>
                              <GiftOutlined /> {t("cart.messages.buy_more")}{" "}
                              <DiscountMoney>
                                {formatCurrency(voucherDifference, currency)}
                              </DiscountMoney>{" "}
                              {t("cart.messages.for_discount")}{" "}
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
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <div className="col-12 mt-2">
          <Title level={5}>{t("order_tracking.modal.labels.orderInfo")}</Title>
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              districtId: Number(viewOrder.address?.districtId),
              districtName: viewOrder.address?.districtName,
              wardCode: viewOrder.address?.wardCode,
              wardName: viewOrder.address?.wardName,
              provinceId: Number(viewOrder.address?.provinceId),
              provinceName: viewOrder.address?.provinceName,
              line: viewOrder.address?.more,
              fullName: viewOrder.fullName,
              phoneNumber: viewOrder.phoneNumber,
              email: viewOrder.email,
              orderNote: viewOrder.note,
            }}
          >
            <Form.Item label={t("order_tracking.modal.fields.code")}>
              <Input value={viewOrder.code} disabled />
            </Form.Item>
            <Form.Item
              label={t("order_tracking.modal.fields.fullName")}
              name="fullName"
              rules={[
                {
                  validator: validateFullName,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={t("order_tracking.modal.fields.email")}
              name="email"
              rules={[
                {
                  validator: validateEmail,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={t("order_tracking.modal.fields.phoneNumber")}
              name="phoneNumber"
              rules={[
                {
                  validator: validatePhoneNumber,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={
                <Space size="large">
                  <Text>{t(`cart.shipping.address.province.title`)}</Text>
                  <Authenticated key="choose-address" fallback={false}>
                    <Button type="default" onClick={showAddress}>
                      {t("buttons.choose_address")}
                    </Button>
                  </Authenticated>
                </Space>
              }
              name="provinceId"
              rules={[
                {
                  validator: (_, value) =>
                    validateCommon(_, value, t, "provinceId"),
                },
              ]}
            >
              <Select
                className="email s-email s-wid"
                showSearch
                placeholder={t(`cart.shipping.address.province.placeholder`)}
                loading={isLoadingProvince}
                onChange={handleProvinceChange}
                filterOption={filterOption}
                options={provinces.map((province) => ({
                  label: province.ProvinceName,
                  value: province.ProvinceID,
                }))}
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
            >
              <Select
                className="email s-email s-wid"
                showSearch
                placeholder={t(`cart.shipping.address.district.title`)}
                loading={isLoadingDistrict}
                onChange={handleDistrictChange}
                filterOption={filterOption}
                options={districts.map((district) => ({
                  label: district.DistrictName,
                  value: district.DistrictID,
                }))}
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
            >
              <Select
                className="email s-email s-wid"
                showSearch
                placeholder={t(`cart.shipping.address.ward.title`)}
                loading={isLoadingWard}
                onChange={handleWardChange}
                filterOption={filterOption}
                options={wards.map((ward) => ({
                  label: ward.WardName,
                  value: ward.WardCode,
                }))}
              />
            </Form.Item>
            <Form.Item
              label={t("success_page.address.line")}
              name="line"
              rules={[
                {
                  validator: (_, value) => validateCommon(_, value, t, "line"),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={t("order_tracking.modal.fields.note")}
              name="orderNote"
            >
              <Input />
            </Form.Item>
          </Form>
        </div>
      </div>
      <Authenticated key="voucher-modal" fallback={false}>
        <VoucherModal
          restModalProps={restVoucherModalProps}
          vouchers={user?.customerVoucherList || []}
          type="apply"
          setViewOrder={setViewOrder}
          close={voucherClose}
        />
        <ListAddressModal
          customer={user}
          modalProps={restAddressModalProps}
          close={closeAddress}
          setAddresses={setAddresses}
        />
      </Authenticated>
      {advancedAddModalProps.open && (
        <AdvancedAddModal
          setViewOrder={setViewOrder}
          modalProps={advancedAddModalProps}
          close={advancedAddClose}
        />
      )}
    </Modal>
  );
};

export default MyOrderModal;

const filterOption = (
  input: string,
  option?: { label: string; value: number | string }
) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

function calculateTotalQuantity(order: IOrderResponse): number {
  let totalQuantity: number = 0;

  order.orderDetails.forEach((orderDetail: IOrderDetailResponse) => {
    totalQuantity += orderDetail.quantity;
  });

  return totalQuantity;
}

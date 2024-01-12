import { CaretDownOutlined, CaretUpOutlined, InfoCircleOutlined, GiftOutlined } from "@ant-design/icons";
import { HttpError, useCustom, useCustomMutation, useGetIdentity, useList, useOne, useUpdate } from "@refinedev/core";
import { Badge, Form, Input, Modal, Select, Space, Tooltip, Typography } from "antd";
import React, { Fragment, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { showWarningConfirmDialog } from "../../helpers/confirm";
import { CurrencyFormatter, formatCurrency } from "../../helpers/currency";
import { getDiscountPrice } from "../../helpers/product";
import { showErrorToast } from "../../helpers/toast";
import { ICustomerResponse, IDistrict, IOrderResponse, IProvince, IVoucherResponse, IWard } from "../../interfaces";
import { RootState } from "../../redux/store";
import { FREE_SHIPPING_THRESHOLD } from "../../constants";
import { DiscountMessage, DiscountMoney } from "../../styled/CartStyled";

const GHN_API_BASE_URL = import.meta.env.VITE_GHN_API_BASE_URL;
const GHN_SHOP_ID = import.meta.env.VITE_GHN_SHOP_ID;
const GHN_TOKEN = import.meta.env.VITE_GHN_USER_TOKEN;

interface MyOrderModalProps {
  restModalProps: {
    open?: boolean | undefined;
    confirmLoading?: boolean | undefined;
    title?: ReactNode;
    closable?: boolean | undefined;
  };
  code: string | undefined;
  callBack: any;
  close: () => void;
  showCancel: () => void;
}

const { Title } = Typography;

const MyOrderModal: React.FC<MyOrderModalProps> = ({ restModalProps, code, callBack, close, showCancel }) => {
  const { t } = useTranslation();
  const currency = useSelector((state: RootState) => state.currency);

  const { mutate: update, isLoading: isLoadingUpdate } = useUpdate();
  const { data, isLoading, isError } = useOne<IOrderResponse, HttpError>({
    resource: "orders/tracking",
    id: code,
  });

  const order = data?.data ? data?.data : ({} as IOrderResponse);

  let cartTotalPrice = 0;

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

  const [discount, setDiscount] = useState<number>(0);

  useEffect(() => {
    setDiscount((prevDiscount) =>
      order.voucher
        ? order.voucher.type === "PERCENTAGE"
          ? (order.voucher.value / 100) * order.originMoney
          : order.voucher.value
        : 0
    );
  }, [order]);

  const { data: user, refetch } = useGetIdentity<ICustomerResponse>();

  const { data: dataV, isLoading: isLoadingVoucher } = useList<IVoucherResponse, HttpError>({
    resource: "vouchers",
    pagination: {
      pageSize: 1000,
    },
    filters: [
      {
        field: "customer",
        operator: "eq",
        value: user?.id,
      },
    ],
  });

  const vouchers = dataV?.data ? dataV?.data : [];

  const [legitVouchers, setLegitVouchers] = useState<IVoucherResponse[]>([]);

  useEffect(() => {
    if (vouchers) {
      const convertedLegitVoucher = vouchers.map((voucher) => {
        const updatedVoucher = { ...voucher };
        if (voucher.type === "PERCENTAGE") {
          updatedVoucher.value = (voucher.value * cartTotalPrice) / 100;
        }
        return updatedVoucher;
      });

      convertedLegitVoucher.sort((a, b) => b.value - a.value);
      setLegitVouchers(convertedLegitVoucher);
    }
  }, [vouchers]);

  const [quantityCount, setQuantityCount] = useState<{
    [productId: string]: number;
  }>({});

  useEffect(() => {
    if (order) setViewOrder(order);
    if (order?.orderDetails && order.orderDetails.length > 0) {
      const updatedQuantityCount = order.orderDetails.reduce((acc, single) => {
        acc[single.id] = single.quantity || 0;
        return acc;
      }, {} as { [productId: string]: number });

      setQuantityCount(updatedQuantityCount);
    }
  }, [order, restModalProps.open]);

  useEffect(() => {
    if (restModalProps.open && viewOrder) {
      form.setFieldsValue({
        districtId: Number(viewOrder.address?.districtId),
        districtName: viewOrder.address?.districtName,
        wardCode: viewOrder.address?.wardCode,
        wardName: viewOrder.address?.wardName,
        provinceId: Number(viewOrder.address?.provinceId),
        provinceName: viewOrder.address?.provinceName,
        line: viewOrder.address?.more,
        fullName: viewOrder.fullName,
        phoneNumber: viewOrder.phoneNumber,
        email: viewOrder.customer?.email,
        orderNote: viewOrder.note,
      });
    }
  }, [restModalProps.open, viewOrder]);

  const { mutate: calculateFeeMutate, isLoading: isLoadingFee } = useCustomMutation<any>();

  const { isLoading: isLoadingProvince, refetch: refetchProvince } = useCustom<IProvince[]>({
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

  const { isLoading: isLoadingDistrict, refetch: refetchDistrict } = useCustom<IDistrict[]>({
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

  const { isLoading: isLoadingWard, refetch: refetchWard } = useCustom<IWard[]>({
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
  });

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
            setViewOrder((prev) => ({
              ...prev,
              shippingMoney: data?.response.data.total as number,
            }));
          },
        }
      );
    }
  }, [provinceId, districtId, wardCode]);

  const handleProvinceChange = (value: number, option: any) => {
    setProvinceName(option.label);
  };

  const handleDistrictChange = (value: number, option: any) => {
    setDistrictName(option.label);
  };

  const handleWardChange = (value: string, option: any) => {
    setWardName(option.label);
  };

  const handleUpdateOrder = () => {
    const simplifiedCartItems: { id: string; quantity: number }[] = viewOrder.orderDetails.map((item) => {
      return { id: item.productDetail.id, quantity: quantityCount[item.id] };
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
      voucher: viewOrder.voucher !== null ? viewOrder.voucher.id : null,
    };

    update(
      {
        resource: `orders`,
        values: submitData,
        id: viewOrder.id,
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

  return (
    <Modal
      title={
        <Space align="baseline">
          <Title level={5}>Đơn hàng của bạn</Title>
          <Tooltip title="Bạn chỉ có thể 1 số thông tin cơ bản của đơn hàng, mọi trường hợp xin vui lòng liên hệ với chúng tôi hoặc tạo đơn mới.">
            <InfoCircleOutlined />
          </Tooltip>
        </Space>
      }
      {...restModalProps}
      open={restModalProps.open}
      width="1200px"
      centered
      okText="Xác nhận thay đổi"
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
                  const discountedPrice = getDiscountPrice(single.price ?? 0, 0);
                  const finalProductPrice = (single.price ?? 0) * currency.currencyRate;

                  const finalDiscountedPrice = discountedPrice !== null ? discountedPrice * currency.currencyRate : 0.0;

                  discountedPrice !== null
                    ? (cartTotalPrice += finalDiscountedPrice * quantityCount[single.id])
                    : (cartTotalPrice += finalProductPrice * quantityCount[single.id]);

                  return (
                    <tr key={key}>
                      <td className="product-thumbnail">
                        <Link to={"/product/" + single.productDetail.product.id}>
                          <img className="img-fluid" src={single.productDetail.image} alt="" />
                        </Link>
                      </td>

                      <td className="product-name">
                        <Link to={"/product/" + single.productDetail.product.id}>
                          {single.productDetail.product.name}
                        </Link>
                        <div className="cart-item-variation">
                          <span>
                            {t(`cart.table.head.color`)}: {single.productDetail.color.name}
                          </span>
                          <span>
                            {t(`cart.table.head.size`)}: {single.productDetail.size.name}
                          </span>
                        </div>
                      </td>

                      <td className="product-price-cart">
                        {discountedPrice !== null ? (
                          <Fragment>
                            <CurrencyFormatter className="amount old" value={finalProductPrice} currency={currency} />
                            <CurrencyFormatter className="amount" value={finalDiscountedPrice} currency={currency} />
                          </Fragment>
                        ) : (
                          <CurrencyFormatter className="amount" value={finalProductPrice} currency={currency} />
                        )}
                      </td>

                      <td className="product-quantity">
                        <div className="cart-plus-minus">
                          <button
                            className="dec qtybutton"
                            onClick={() => {
                              setQuantityCount((prevQuantityCount) => {
                                const updatedQuantityCount = {
                                  ...prevQuantityCount,
                                };

                                if (updatedQuantityCount[single.id] > 1) {
                                  updatedQuantityCount[single.id] -= 1;
                                } else {
                                  const cartCount = viewOrder.orderDetails.length;
                                  if (cartCount == 1) {
                                    showWarningConfirmDialog({
                                      options: {
                                        message:
                                          "Giảm số lượng về 0 khi giỏ hàng còn 1 sản phẩm tương đương với việc huỷ đơn hàng",
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
                                        message: "Giảm số lượng về 0 tương đương với việc loại bỏ sản phẩm khỏi giỏ",
                                        accept: () => {
                                          setViewOrder((prev) => ({
                                            ...prev,
                                            orderDetails: prev.orderDetails.filter((detail) => detail.id !== single.id),
                                          }));
                                        },
                                        reject: () => {
                                          console.log("Huỷ");
                                        },
                                      },
                                      t: t,
                                    });
                                  }
                                }

                                return updatedQuantityCount;
                              });
                            }}
                          >
                            -
                          </button>

                          <input
                            className="cart-plus-minus-box"
                            type="text"
                            value={quantityCount[single.id]}
                            onChange={(e) => {
                              const newValue = parseInt(e.target.value, 10);
                              if (newValue >= single.productDetail.quantity) {
                                return showErrorToast("Rất tiếc, đã đạt giới hạn số lượng sản phẩm");
                              }
                              if (newValue > 5) {
                                return showErrorToast(
                                  "Bạn chỉ có thể mua tối da 5 sản phẩm, vui lòng liên hệ với chúng tôi nếu có nhu cầu mua số lượng lớn"
                                );
                              }
                              if (!isNaN(newValue)) {
                                setQuantityCount((prevQuantityCount) => {
                                  const updatedQuantityCount = {
                                    ...prevQuantityCount,
                                  };
                                  if (updatedQuantityCount[single.id]) {
                                    updatedQuantityCount[single.id] = newValue;
                                  }

                                  return updatedQuantityCount;
                                });
                              }
                            }}
                          />
                          <button
                            className="inc qtybutton"
                            onClick={() => {
                              if (quantityCount[single.id] >= single.productDetail.quantity) {
                                return showErrorToast("Rất tiếc, đã đạt giới hạn số lượng sản phẩm");
                              }

                              if (quantityCount[single.id] >= 5) {
                                return showErrorToast(
                                  "Bạn chỉ có thể mua tối da 5 sản phẩm, vui lòng liên hệ với chúng tôi nếu có nhu cầu mua số lượng lớn"
                                );
                              }
                              setQuantityCount((prevQuantityCount) => {
                                const updatedQuantityCount = {
                                  ...prevQuantityCount,
                                };
                                if (updatedQuantityCount[single.id]) {
                                  updatedQuantityCount[single.id] += 1;
                                }

                                return updatedQuantityCount;
                              });
                            }}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="product-subtotal">
                        <CurrencyFormatter
                          className="amount"
                          value={
                            discountedPrice !== null
                              ? finalDiscountedPrice * quantityCount[single.id]
                              : finalProductPrice * quantityCount[single.id]
                          }
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
                                  message: "Loại bỏ sản phẩm duy nhất tương đương với việc huỷ đơn hàng",
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
                                      orderDetails: prev.orderDetails.filter((detail) => detail.id !== single.id),
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
                        <Badge
                          count={
                            cartTotalPrice != order.originMoney ? (
                              cartTotalPrice > order.originMoney ? (
                                <CaretUpOutlined style={{ color: "red" }} />
                              ) : (
                                <CaretDownOutlined style={{ color: "green" }} />
                              )
                            ) : (
                              0
                            )
                          }
                        >
                          <h5>{t(`cart.cart_total.total`)} </h5>
                        </Badge>
                      </div>
                      <div className="col-3">
                        <CurrencyFormatter className="amount" value={cartTotalPrice} currency={currency} />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-9">
                        <Badge
                          count={
                            viewOrder.shippingMoney !== order.shippingMoney ? (
                              viewOrder.shippingMoney > order.shippingMoney ? (
                                <CaretUpOutlined style={{ color: "red" }} />
                              ) : (
                                <CaretDownOutlined style={{ color: "green" }} />
                              )
                            ) : (
                              0
                            )
                          }
                        >
                          <h5>{t(`cart.cart_total.shipping`)} </h5>
                        </Badge>
                      </div>
                      <div className="col-3">
                        <CurrencyFormatter className="amount" value={viewOrder.shippingMoney} currency={currency} />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-9">
                        <h5>Giảm giá</h5>
                      </div>
                      <div className="col-3">
                        <CurrencyFormatter
                          className="amount"
                          value={
                            viewOrder.voucher
                              ? viewOrder.voucher.type == "PERCENTAGE"
                                ? (viewOrder.voucher.value * cartTotalPrice) / 100
                                : viewOrder.voucher.value
                              : 0
                          }
                          currency={currency}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-9">
                        <Badge
                          count={
                            cartTotalPrice + viewOrder.shippingMoney - discount !== order.totalMoney ? (
                              cartTotalPrice + viewOrder.shippingMoney - discount > order.totalMoney ? (
                                <CaretUpOutlined style={{ color: "red" }} />
                              ) : (
                                <CaretDownOutlined style={{ color: "green" }} />
                              )
                            ) : (
                              0
                            )
                          }
                        >
                          <h4 className="grand-totall-title">{t(`cart.cart_total.grand_total`)} </h4>
                        </Badge>
                      </div>
                      <div className="col-3">
                        <CurrencyFormatter
                          className="amount"
                          value={cartTotalPrice + viewOrder.shippingMoney - discount}
                          currency={currency}
                        />
                      </div>
                    </div>
                    <div className="row">
                      {cartTotalPrice < FREE_SHIPPING_THRESHOLD ? (
                        <DiscountMessage>
                          <GiftOutlined /> Mua thêm{" "}
                          <DiscountMoney>
                            {formatCurrency(FREE_SHIPPING_THRESHOLD - cartTotalPrice, currency)}
                          </DiscountMoney>{" "}
                          để được miễn phí vận chuyển
                        </DiscountMessage>
                      ) : (
                        ""
                      )}
                      {legitVouchers.length > 0 &&
                        cartTotalPrice < legitVouchers[0].constraint &&
                        !viewOrder.voucher && (
                          <DiscountMessage>
                            <GiftOutlined /> Mua thêm{" "}
                            <DiscountMoney>
                              {formatCurrency(legitVouchers[0].constraint - cartTotalPrice, currency)}
                            </DiscountMoney>{" "}
                            để được giảm tới{" "}
                            <DiscountMoney>{formatCurrency(legitVouchers[0].value, currency)}</DiscountMoney>
                          </DiscountMessage>
                        )}
                    </div>
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <div className="col-12 mt-2">
          <Title level={5}>Thông tin đơn hàng</Title>
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
              email: viewOrder.customer?.email,
              orderNote: viewOrder.note,
            }}
          >
            <Form.Item label="Mã hoá đơn">
              <Input value={viewOrder.code} disabled />
            </Form.Item>
            <Form.Item label="Tên đầy đủ" name="fullName">
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input />
            </Form.Item>
            <Form.Item label="Số điện thoại" name="phoneNumber">
              <Input />
            </Form.Item>
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
            <Form.Item
              label="Chi tiết địa chỉ"
              name="line"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Ghi chú hoá đơn" name="orderNote">
              <Input.TextArea />
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default MyOrderModal;

const filterOption = (input: string, option?: { label: string; value: number | string }) =>
  (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

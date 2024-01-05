import { HttpError, useCustom, useOne } from "@refinedev/core";
import { Button, Form, Input, Modal, Select, Space, Typography } from "antd";
import React, { Fragment, ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IDistrict, IOrderResponse, IProvince, IWard } from "../../interfaces";
import { RootState } from "../../redux/store";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { CurrencyFormatter } from "../../helpers/currency";
import { showErrorToast } from "../../helpers/toast";
import { getDiscountPrice } from "../../helpers/product";

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
}

const { Title } = Typography;

const MyOrderModal: React.FC<MyOrderModalProps> = ({
  restModalProps,
  code,
}) => {
  const { t } = useTranslation();
  const currency = useSelector((state: RootState) => state.currency);

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

  return (
    <Modal
      title="Đơn hàng của bạn"
      {...restModalProps}
      open={restModalProps.open}
      width="1200px"
      centered
      okText="Xác nhận thay đổi"
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
                {order?.orderDetails?.map((single, key) => {
                  const discountedPrice = getDiscountPrice(
                    single.price ?? 0,
                    0
                  );
                  const finalProductPrice =
                    (single.price ?? 0) * currency.currencyRate;

                  const finalDiscountedPrice =
                    discountedPrice !== null
                      ? discountedPrice * currency.currencyRate
                      : 0.0;

                  discountedPrice !== null
                    ? (cartTotalPrice += finalDiscountedPrice * single.quantity)
                    : (cartTotalPrice += finalProductPrice * single.quantity);

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
                          <button
                            className="dec qtybutton"
                            // onClick={() => dispatch(decreaseFromDB(cartItem))}
                          >
                            -
                          </button>
                          <input
                            className="cart-plus-minus-box"
                            type="text"
                            value={single.quantity}
                            // onChange={(e) => {
                            //   const newValue = parseInt(e.target.value, 10);
                            //   if (
                            //     newValue >=
                            //     cartItemStock(cartItem.selectedProductSize)
                            //   ) {
                            //     return showErrorToast(
                            //       "Rất tiếc, đã đạt giới hạn số lượng sản phẩm"
                            //     );
                            //   }
                            //   if (newValue > 5) {
                            //     return showErrorToast(
                            //       "Bạn chỉ có thể mua tối da 5 sản phẩm, vui lòng liên hệ với chúng tôi nếu có nhu cầu mua số lượng lớn"
                            //     );
                            //   }
                            //   if (!isNaN(newValue)) {
                            //     updateQuantity({
                            //       ...cartItem,
                            //       quantity: newValue,
                            //       showNoti: false,
                            //     });
                            //     updateQuantityFromDB({
                            //       ...cartItem,
                            //       quantity: newValue,
                            //     });
                            //   }
                            // }}
                          />
                          <button
                            className="inc qtybutton"
                            // onClick={() => {
                            //   if (
                            //     cartItem !== undefined &&
                            //     cartItem.quantity !== undefined &&
                            //     cartItem.quantity >=
                            //       cartItemStock(cartItem.selectedProductSize)
                            //   ) {
                            //     return showErrorToast(
                            //       "Rất tiếc, đã đạt giới hạn số lượng sản phẩm"
                            //     );
                            //   }

                            //   if (cartItem.quantity >= 5) {
                            //     return showErrorToast(
                            //       "Bạn chỉ có thể mua tối da 5 sản phẩm, vui lòng liên hệ với chúng tôi nếu có nhu cầu mua số lượng lớn"
                            //     );
                            //   }
                            //   dispatch(
                            //     addToDB({
                            //       ...cartItem,
                            //       quantity: quantityCount,
                            //     })
                            //   );
                            // }}
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
                              ? finalDiscountedPrice * single.quantity
                              : finalProductPrice * single.quantity
                          }
                          currency={currency}
                        />
                      </td>

                      <td className="product-remove">
                        <button
                        // onClick={() => dispatch(deleteFromDB(cartItem.id))}
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
        <div className="col-12 mt-2">
          <Title level={5}>Thông tin đơn hàng</Title>
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              districtId: order.address?.districtId,
              districtName: order.address?.districtName,
              wardCode: order.address?.wardCode,
              wardName: order.address?.wardName,
              provinceId: order.address?.provinceId,
              provinceName: order.address?.provinceName,
              line: order.address?.more,
              fullName: order.fullName,
              phoneNumber: order.phoneNumber,
              email: order.customer?.email,
              orderNote: order.note,
            }}
          >
            <Form.Item label="Mã hoá đơn">
              <Input value={order.code} disabled />
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
              initialValue={
                order.address ? Number(order.address.provinceId) : ""
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
                order.address ? Number(order.address.districtId) : ""
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
            <Form.Item
              label={t(`cart.shipping.address.ward.title`)}
              name="wardCode"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn phường/xã!",
                },
              ]}
              initialValue={order.address ? order.address.wardCode : ""}
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

const filterOption = (
  input: string,
  option?: { label: string; value: number | string }
) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

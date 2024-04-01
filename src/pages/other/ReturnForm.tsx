import { LeftOutlined } from "@ant-design/icons";
import { useForm } from "@refinedev/antd";
import { HttpError, useCustom, useOne } from "@refinedev/core";
import { useDocumentTitle } from "@refinedev/react-router-v6";
import { Button, Form, Spin } from "antd";
import { motion } from "framer-motion";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useParams } from "react-router-dom";
import { CHILDREN_VARIANT, PARENT_VARIANT } from "../../constants/motions";
import { showWarningConfirmDialog } from "../../helpers/confirm";
import { showWarningToast } from "../../helpers/toast";
import {
  validateCommon,
  validateFullName,
  validatePhoneNumber,
} from "../../helpers/validate";
import {
  IDistrict,
  IOrderResponse,
  IProvince,
  IReturnFormDetailRequest,
  IWard,
} from "../../interfaces";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";

const GHN_API_BASE_URL = import.meta.env.VITE_GHN_API_BASE_URL;
const GHN_TOKEN = import.meta.env.VITE_GHN_USER_TOKEN;

const ReturnForm = () => {
  const { t } = useTranslation();
  let { pathname } = useLocation();
  let { id } = useParams();

  const { data, isLoading, isError, refetch } = useOne<
    IOrderResponse,
    HttpError
  >({
    resource: "orders",
    id: id,
    errorNotification: (error, values, resource) => {
      return {
        message: error?.message + "",
        description: "Oops... " + t("common.error"),
        type: "error",
      };
    },
  });

  const order = data?.data ? data?.data : ({} as IOrderResponse);

  const [returnDetails, setReturnDetails] =
    useState<IReturnFormDetailRequest[]>();
  const [hasAgreed, setHasAgreed] = useState<boolean>(false);

  const { onFinish, formProps, saveButtonProps, formLoading } = useForm<{
    provinceId: number;
    districtId: number;
    wardCode: string;
    line: string;
    fullName: string;
    phoneNumber: string;
    paymentInfo: string;
  }>({
    resource: "return-forms",
    action: "create",
    redirect: false,
    onMutationSuccess: (data, variables, context, isAutoSave) => {},
  });

  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [wards, setWards] = useState<IWard[]>([]);
  const provinceId = Form.useWatch("provinceId", formProps.form);
  const districtId = Form.useWatch("districtId", formProps.form);
  const wardCode = Form.useWatch("wardCode", formProps.form);
  const [provinceName, setProvinceName] = useState(
    order.address ? order.address.provinceName || "" : ""
  );
  const [districtName, setDistrictName] = useState(
    order.address ? order.address.districtName || "" : ""
  );
  const [wardName, setWardName] = useState(
    order.address ? order.address.wardName || "" : ""
  );

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
      formProps.form?.setFieldValue("districtId", null);
      formProps.form?.setFieldValue("wardCode", "");
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

  useEffect(() => {
    const generateReturnDetails = (
      order: IOrderResponse | undefined
    ): IReturnFormDetailRequest[] => {
      if (!order) return [];

      return order.orderDetails?.map((orderDetail) => ({
        orderDetail: orderDetail,
        orderCode: order.code,
        quantity: orderDetail.quantity,
        returnQuantity: 0,
        name: `${orderDetail.productDetail.product.name}`,
        unitPrice: orderDetail.price,
        selected: false,
        feedback: "",
        reason: "",
      }));
    };

    setReturnDetails(generateReturnDetails(order));
  }, [order]);

  const setTitle = useDocumentTitle();

  useEffect(() => {
    setTitle(t("nav.return") + " | SUNS");
  }, [t]);

  const handleQuantityChange = (
    value: number | undefined,
    record: IReturnFormDetailRequest
  ) => {
    if (value === undefined || isNaN(value)) {
      return showWarningToast(t("return-forms.message.invalidQuantityInput"));
    }

    if (returnDetails) {
      const index = returnDetails.findIndex(
        (returnDetail) => returnDetail.orderDetail === record.orderDetail
      );

      if (index !== -1) {
        const originalQuantity = returnDetails[index].quantity;

        if (value > originalQuantity) {
          return showWarningToast(
            t("return-forms.message.invalidReturnQuantity")
          );
        }

        const updatedReturnDetails = [...returnDetails];
        updatedReturnDetails[index] = {
          ...updatedReturnDetails[index],
          returnQuantity: value,
        };
        setReturnDetails(updatedReturnDetails);
      }
    }
  };

  const handleIncreaseQuantity = (record: IReturnFormDetailRequest) => {
    if (returnDetails) {
      const updatedReturnDetails = returnDetails.map((detail) => {
        if (detail.orderDetail === record.orderDetail) {
          if (detail.quantity == detail.returnQuantity) {
            showWarningToast(t("return-forms.message.invalidReturnQuantity"));
            return { ...detail };
          }
          return {
            ...detail,
            returnQuantity: detail.returnQuantity + 1,
          };
        }
        return detail;
      });
      setReturnDetails(updatedReturnDetails);
    }
  };

  const handleDecreaseQuantity = (record: IReturnFormDetailRequest) => {
    if (returnDetails) {
      const updatedReturnDetails = returnDetails.map((detail) => {
        if (
          detail.orderDetail === record.orderDetail &&
          detail.returnQuantity > 0
        ) {
          return {
            ...detail,
            returnQuantity: detail.returnQuantity - 1,
          };
        }
        return detail;
      });
      setReturnDetails(updatedReturnDetails);
    }
  };

  const handleToggleSelected = (record: IReturnFormDetailRequest) => {
    if (returnDetails) {
      const updatedReturnDetails = returnDetails.map((detail) => {
        if (detail.orderDetail === record.orderDetail) {
          return {
            ...detail,
            selected: !detail.selected,
          };
        }
        return detail;
      });
      setReturnDetails(updatedReturnDetails);
    }
  };

  const handleReasonChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    record: IReturnFormDetailRequest
  ) => {
    if (returnDetails) {
      const updatedReturnDetails = returnDetails.map((detail) => {
        if (detail.orderDetail === record.orderDetail) {
          return {
            ...detail,
            reason: event.target.value, // Cập nhật trường reason với giá trị mới
          };
        }
        return detail;
      });
      setReturnDetails(updatedReturnDetails);
    }
  };

  const handleFeedbackChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    record: IReturnFormDetailRequest
  ) => {
    if (returnDetails) {
      const updatedReturnDetails = returnDetails.map((detail) => {
        if (detail.orderDetail === record.orderDetail) {
          return {
            ...detail,
            feedback: event.target.value, // Cập nhật trường feedback với giá trị mới
          };
        }
        return detail;
      });
      setReturnDetails(updatedReturnDetails);
    }
  };

  const handleOnFinish = (values: any) => {
    if (!hasAgreed) {
      return showWarningToast(t("return-forms.message.notAgree"));
    }

    const hasSelected = returnDetails?.some((item) => item.selected) || false;

    if (!hasSelected) {
      showWarningToast(t("return-forms.message.emptySelected"));
      return;
    }

    const isValid = returnDetails
      ?.filter((item) => item.selected)
      .every((returnFormDetail) =>
        Object.values(returnFormDetail).every(
          (value) => value !== "" && value !== undefined
        )
      );

    if (!isValid) {
      return showWarningToast(t("return-forms.message.emptyReturnDetails"));
    }

    const hasZeroReturnQuantity = returnDetails
      ?.filter((item) => item.selected)
      .some((row) => {
        return row.returnQuantity === 0;
      });

    if (hasZeroReturnQuantity) {
      return showWarningToast(t("return-forms.message.emptyReturnQuantity"));
    }

    const returnFormDetailsPayload =
      returnFormDetailsToPayloadFormat(returnDetails);

    const submitData = {
      address: {
        phoneNumber: formProps.form?.getFieldValue("phoneNumber"),
        districtId: formProps.form?.getFieldValue("districtId"),
        districtName: districtName,
        provinceId: formProps.form?.getFieldValue("provinceId"),
        provinceName: provinceName,
        wardCode: formProps.form?.getFieldValue("wardCode"),
        wardName: wardName,
        more: formProps.form?.getFieldValue("line"),
      },
      order: order?.id,
      paymentInfo: formProps.form?.getFieldValue("paymentInfo"),
      returnFormDetails: returnFormDetailsPayload,
    };
    showWarningConfirmDialog({
      options: {
        accept: () => {
          onFinish(submitData);
        },
        reject: () => {},
      },
      t: t,
    });
  };

  return (
    <Fragment>
      <Breadcrumb
        pages={[
          { label: "home", path: "/" },
          { label: "pages.return", path: pathname },
        ]}
      />
      <Spin spinning={isLoading}>
        <div className="cart-main-area pt-90 pb-100 bg-white">
          <div className="container">
            {returnDetails && returnDetails?.length >= 1 ? (
              <Form
                {...formProps}
                name="app-info"
                layout="inline"
                onFinish={handleOnFinish}
                autoComplete="off"
              >
                <div className="container">
                  <div className="cart-tax policy-section">
                    <div className="row policy-header">
                      <div className="col-md-3 app-icon">
                        <img
                          className="img-fluid"
                          src="/images/logo/sunsneaker_logo.png"
                          alt="Sunsneaker Logo"
                        />
                      </div>
                      <div
                        className="col-md-9 title"
                        style={{
                          fontSize: "36px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "start",
                        }}
                      >
                        Phiếu Yêu Cầu Trả Hàng
                      </div>
                    </div>
                    <div className="policy-wrapper mt-3">
                      <div className="policy-content mb-3">
                        Tất cả yêu cầu trả hàng đều phải tuân thủ theo Chính
                        sách Trả hàng của adidas <br />
                        <Link
                          to={
                            "https://www.adidas.com.vn/en/help/sea-returns-refunds/what-are-the-conditions-for-returning-my-products"
                          }
                        >
                          https://www.adidas.com.vn/en/help/sea-returns-refunds/what-are-the-conditions-for-returning-my-products
                        </Link>
                      </div>
                      <div className="policy-content mb-3">
                        Vui lòng điền đầy đủ thông tin vào Phiếu Yêu Cầu Trả
                        Hàng và đội ngũ Dịch vụ khách hàng sẽ gửi Mẫu Hoàn Trả
                        Hàng đến bạn qua email trong vòng 3 ngày làm việc. Mẫu
                        Hoàn Trả Hàng phải được in ra và đính kèm trong bưu kiện
                        của sản phẩm được trả lại.
                      </div>
                      <div className="policy-content mb-3">
                        Xin lưu ý: <br />
                        Yêu cầu trả hàng không áp dụng cho sản phẩm có quy định
                        “Không đổi trả, không hoàn tiền” trên trang sản phẩm.
                        Tuy nhiên, vui lòng liên hệ với chúng tôi tại các kênh
                        hỗ trợ
                        <br />
                        <Link to="https://www.adidas.com.vn/en/help/sea-contact/contact-us">
                          https://www.adidas.com.vn/en/help/sea-contact/contact-us
                        </Link>
                        nếu sản phẩm của bạn bị hỏng/ bị lỗi hoặc bạn nhận được
                        (các) sản phẩm mà bạn không đặt hàng.
                      </div>
                      <div className="policy-content mb-3">
                        Yêu cầu trả hàng sẽ không được thực hiện nếu thông tin
                        bạn cung cấp không chính xác hoặc không đầy đủ. Vui lòng
                        gửi lại yêu cầu trả hàng nếu bạn không nhận được Mẫu
                        Hoàn Trả Hàng sau 3 ngày làm việc, hoặc bạn có thể liên
                        hệ với đội ngũ Dịch vụ khách hàng của chúng tôi tại
                        <Link to="https://www.adidas.com.vn/en/help/sea-contact/contact-us">
                          https://www.adidas.com.vn/en/help/sea-contact/contact-us
                        </Link>
                        để được hỗ trợ.
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between mt-5">
                    <h3 className="cart-page-title mb-2">
                      Chọn sản phẩm hoàn trả
                    </h3>
                    <h4 className="mb-2">
                      Mã hoá đơn: #{order.code.toUpperCase()}
                    </h4>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <div className="table-content table-responsive cart-table-content">
                        <motion.table
                          layout
                          style={{
                            overflow: "hidden",
                            width: "100%",
                          }}
                        >
                          <motion.thead layout>
                            <motion.tr>
                              <th></th>
                              <th>{t(`cart.table.head.image`)}</th>
                              <th style={{ width: "10%" }}>Sản phẩm</th>
                              <th style={{ width: "10%" }}>Số lượng</th>
                              <th style={{ width: "10%" }}>SL hoàn trả</th>
                              <th>Lý do</th>
                              <th>Feedback</th>
                            </motion.tr>
                          </motion.thead>
                          <motion.tbody
                            layout
                            variants={PARENT_VARIANT}
                            initial="hidden"
                            animate="show"
                          >
                            {returnDetails.map((returnDetail, key) => {
                              return (
                                <motion.tr
                                  key={key}
                                  layout
                                  variants={CHILDREN_VARIANT}
                                >
                                  <td className="row-select">
                                    <input
                                      type="checkbox"
                                      className="w-25"
                                      checked={returnDetail.selected}
                                      onChange={() =>
                                        handleToggleSelected(returnDetail)
                                      }
                                    />
                                  </td>
                                  <td className="product-thumbnail">
                                    <Link
                                      to={
                                        "/product/" +
                                        returnDetail.orderDetail.productDetail
                                          .product.id
                                      }
                                    >
                                      <img
                                        className="img-fluid"
                                        src={
                                          returnDetail.orderDetail.productDetail
                                            .product.image
                                        }
                                        alt=""
                                      />
                                    </Link>
                                  </td>
                                  <td className="product-name text-center">
                                    {returnDetail.name}
                                    <br />
                                  </td>

                                  <td className="product-quantity">
                                    {returnDetail.quantity}
                                  </td>
                                  <td className="product-quantity">
                                    <div className="cart-plus-minus">
                                      <button
                                        className="dec qtybutton"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleDecreaseQuantity(returnDetail);
                                        }}
                                      >
                                        -
                                      </button>
                                      <input
                                        className="cart-plus-minus-box"
                                        type="text"
                                        value={returnDetail.returnQuantity}
                                        onChange={(
                                          e: React.ChangeEvent<HTMLInputElement>
                                        ) =>
                                          handleQuantityChange(
                                            parseInt(e.target.value),
                                            returnDetail
                                          )
                                        }
                                      />
                                      <button
                                        className="inc qtybutton"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleIncreaseQuantity(returnDetail);
                                        }}
                                      >
                                        +
                                      </button>
                                    </div>
                                  </td>
                                  <td className="product-quantity">
                                    <div className="cart-plus-minus w-100 pe-2">
                                      <textarea
                                        id="reason-field"
                                        className="cart-plus-minus-box w-100"
                                        value={returnDetail.reason}
                                        onChange={(e) =>
                                          handleReasonChange(e, returnDetail)
                                        }
                                        maxLength={500}
                                      />
                                    </div>
                                  </td>
                                  <td className="product-quantity">
                                    <div className="cart-plus-minus w-100 pe-2">
                                      <textarea
                                        id="feedback-field"
                                        className="cart-plus-minus-box w-100"
                                        value={returnDetail.feedback}
                                        onChange={(e) =>
                                          handleFeedbackChange(e, returnDetail)
                                        }
                                        maxLength={500}
                                      />
                                    </div>
                                  </td>
                                </motion.tr>
                              );
                            })}
                          </motion.tbody>
                        </motion.table>
                      </div>
                    </div>
                  </div>

                  <div className="container">
                    <div className="return-information mt-5">
                      <div className="row justify-content-between">
                        <div className="col-md-5 cart-tax">
                          <h3 className="cart-page-title mb-2">
                            Thông tin giao hàng
                          </h3>
                          <div className="app-info mb-20">
                            <label>Tên người nhận</label>
                            <Form.Item
                              name="fullName"
                              required
                              rules={[
                                {
                                  validator: (_, value) =>
                                    validateFullName(_, value),
                                },
                              ]}
                            >
                              <input type="text" placeholder="NGUYEN VAN A" />
                            </Form.Item>
                          </div>
                          <div className="app-info mb-20">
                            <label>Số điện thoại người nhận</label>
                            <Form.Item
                              name="phoneNumber"
                              required
                              rules={[
                                {
                                  validator: (_, value) =>
                                    validatePhoneNumber(_, value),
                                },
                              ]}
                            >
                              <input type="text" placeholder="0888888888" />
                            </Form.Item>
                          </div>
                          <div className="app-select mb-20">
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
                          <div className="app-select mb-20">
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
                                  <option value="">
                                    Đang tải quận/huyện...
                                  </option>
                                </select>
                              )}
                            </Form.Item>
                          </div>
                          <div className="app-select mb-20">
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
                          <div className="app-info mb-20">
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
                        <div className="col-md-5 cart-tax">
                          <h3 className="cart-page-title mb-2">
                            Thông tin thanh toán
                          </h3>
                          <div className="app-info mb-20">
                            <label>Tên ngân hàng & Số tài khoản</label>
                            <Form.Item
                              name="paymentInfo"
                              required
                              rules={[
                                {
                                  validator: (_, value) =>
                                    validateCommon(_, value, t, "paymentInfo"),
                                },
                              ]}
                            >
                              <input
                                type="text"
                                placeholder="VCB NGUYEN VAN A XXXXXXXXXXXXXXXXXXX"
                              />
                            </Form.Item>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="submit-return-form cart-tax mt-5">
                    <div className="submit-header justify-content-end row">
                      <div className="col-md-5">
                        <div className="app-info mb-20">
                          <input
                            type="checkbox"
                            id="agree-policy"
                            className="me-2"
                            checked={hasAgreed}
                            onChange={() => setHasAgreed(!hasAgreed)}
                          />
                          <label htmlFor="agree-policy">
                            Tôi đồng ý với chính sách hoàn trả của cửa hàng
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="submit-footer justify-content-between row">
                      <div className="col-md-5">
                        <Button type="link" icon={<LeftOutlined />}>
                          Quay lại trang thông tin đơn hàng
                        </Button>
                      </div>
                      <div className="col-md-5">
                        <Button
                          htmlType="submit"
                          {...saveButtonProps}
                          className="default-btn"
                          type="primary"
                          style={{
                            width: "100%",
                          }}
                        >
                          Gửi phiếu yêu cầu hoàn trả
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
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
                      <i className="pe-7s-shield"></i>
                    </div>
                    <div className="item-empty-area__text">
                      Không tìm thấy đơn hàng hoặc dơn hàng không đủ điều kiện
                      hoàn trả
                      <br /> Vui lòng liên hệ với chúng tôi để giải quyết nếu
                      bạn không thể tìm thấy đơn hàng của mình
                      <br />
                      <Link to={"/shop"}>{t(`cart.buttons.add_items`)}</Link>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </Spin>
    </Fragment>
  );
};

export default ReturnForm;

export const returnFormDetailsToPayloadFormat = (
  returnFormDetails: IReturnFormDetailRequest[] | undefined
): any[] => {
  if (!returnFormDetails) return [];

  return returnFormDetails.map((detail) => {
    return {
      id: detail.id,
      orderDetail: detail.orderDetail.id,
      quantity: detail.returnQuantity,
      reason: detail.reason,
      feedback: detail.feedback,
    };
  });
};

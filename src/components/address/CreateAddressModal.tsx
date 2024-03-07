import { useCustom, useTranslate } from "@refinedev/core";
import { Modal, ModalProps, Form, FormProps, Input, Select, Grid } from "antd";
import { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import clsx from "clsx";
import {
  ICustomerResponse,
  IDistrict,
  IProvince,
  IWard,
} from "../../interfaces";
import { validateCommon, validatePhoneNumber } from "../../helpers/validate";

type CreateAddressModalProps = {
  modalProps: ModalProps;
  formProps: FormProps;
  onFinish: (values: any) => void;
  customer: ICustomerResponse | undefined;
};

const GHN_API_BASE_URL = import.meta.env.VITE_GHN_API_BASE_URL;
const token = import.meta.env.VITE_GHN_USER_TOKEN;

export const CreateAddressModal: React.FC<CreateAddressModalProps> = ({
  modalProps,
  formProps,
  onFinish,
  customer,
}) => {
  const t = useTranslate();
  const breakpoint = Grid.useBreakpoint();
  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [wards, setWards] = useState<IWard[]>([]);

  const provinceId = Form.useWatch("provinceId", formProps.form);
  const districtId = Form.useWatch("districtId", formProps.form);
  const [provinceName, setProvinceName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [wardName, setWardName] = useState("");

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

  const { isLoading: isLoadingProvince, refetch: refetchProvince } = useCustom<
    IProvince[]
  >({
    url: `${GHN_API_BASE_URL}/master-data/province`,
    method: "get",
    config: {
      headers: {
        token: token,
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
        token: token,
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
          token: token,
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

  const onFinishHandler = (values: any) => {
    const updatedValues = {
      ...values,
      customer: customer?.id,
      phoneNumber: formProps.form?.getFieldValue("phoneNumber"),
      districtId: formProps.form?.getFieldValue("districtId"),
      districtName: districtName,
      provinceId: formProps.form?.getFieldValue("provinceId"),
      provinceName: provinceName,
      wardCode: formProps.form?.getFieldValue("wardCode"),
      wardName: wardName,
      more: formProps.form?.getFieldValue("more"),
      isDefault: false,
    };

    onFinish(updatedValues);
  };

  return (
    <Modal
      {...modalProps}
      width={breakpoint.sm ? "500px" : "100%"}
      zIndex={1002}
      footer={<></>}
      title="Tạo địa chỉ mới"
    >
      <Form {...formProps} onFinish={onFinishHandler}>
        <div className="billing-info-wrap">
          <div className="row">
            <div className="col-12">
              <div className="billing-info mb-20">
                <label>Số điện thoại</label>
                <Form.Item
                  name="phoneNumber"
                  rules={[
                    {
                      validator: validatePhoneNumber,
                    },
                  ]}
                >
                  <input id="phoneNumber-create" type="text" />
                </Form.Item>
              </div>
            </div>
            <div className="col-12">
              <div className="billing-select mb-20">
                <label>Tỉnh/thành phố</label>
                <Form.Item
                  name="provinceId"
                  rules={[
                    {
                      validator: (_, value) =>
                        validateCommon(_, value, t, "provinceId"),
                    },
                  ]}
                >
                  {provinces.length > 0 ? (
                    <select
                      id="provinceId-create"
                      onChange={handleProvinceChange}
                    >
                      <option value="">--Chọn tỉnh/thành phố--</option>
                      {provinces.map((province, index) => (
                        <option key={index} value={province.ProvinceID}>
                          {province.ProvinceName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select id="provinceId-create">
                      <option value="">Đang tải tỉnh/thành phố...</option>
                    </select>
                  )}
                </Form.Item>
              </div>
            </div>
            <div className="col-12">
              <div className="billing-select mb-20">
                <label>Quận/huyện</label>
                <Form.Item
                  name="districtId"
                  rules={[
                    {
                      validator: (_, value) =>
                        validateCommon(_, value, t, "districtId"),
                    },
                  ]}
                >
                  {districts.length > 0 ? (
                    <select
                      id="districtId-create"
                      onChange={handleDistrictChange}
                    >
                      <option value="">--Chọn quận/huyện--</option>
                      {districts.map((district, index) => (
                        <option key={index} value={district.DistrictID}>
                          {district.DistrictName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select id="districtId-create">
                      <option value="">Đang tải quận/huyện...</option>
                    </select>
                  )}
                </Form.Item>
              </div>
            </div>
            <div className="col-12">
              <div className="billing-select mb-20">
                <label>Phường/xã</label>
                <Form.Item
                  name="wardCode"
                  rules={[
                    {
                      validator: (_, value) =>
                        validateCommon(_, value, t, "wardCode"),
                    },
                  ]}
                >
                  {wards.length > 0 ? (
                    <select id="wardCode-create" onChange={handleWardChange}>
                      <option value="">--Chọn phường/xã--</option>
                      {wards.map((ward, index) => (
                        <option key={index} value={ward.WardCode}>
                          {ward.WardName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select id="wardCode-create">
                      <option value="">Đang tải phường/...</option>
                    </select>
                  )}
                </Form.Item>
              </div>
            </div>
            <div className="col-12">
              <div className="billing-info mb-20">
                <label>Chi tiết địa chỉ</label>
                <Form.Item
                  name="more"
                  rules={[
                    {
                      validator: (_, value) =>
                        validateCommon(_, value, t, "more"),
                    },
                  ]}
                >
                  <input id="more-create" type="text" />
                </Form.Item>
              </div>
            </div>
          </div>
          <div className="billing-back-btn">
            <div className="billing-btn">
              <button
                className={clsx({ loading: modalProps.confirmLoading })}
                type="submit"
              >
                <span className="loading me-3">
                  <LoadingOutlined />
                </span>
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

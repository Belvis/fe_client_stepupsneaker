import { LoadingOutlined } from "@ant-design/icons";
import { useCustom, useTranslate } from "@refinedev/core";
import { Form, FormProps, Grid, Modal, ModalProps } from "antd";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { IDistrict, IProvince, IWard } from "../../interfaces";

type EditAddressModalProps = {
  modalProps: ModalProps;
  formProps: FormProps;
  onFinish: (values: any) => void;
};

const GHN_API_BASE_URL = import.meta.env.VITE_GHN_API_BASE_URL;
const token = import.meta.env.VITE_GHN_USER_TOKEN;

export const EditAddressModal: React.FC<EditAddressModalProps> = ({
  modalProps,
  formProps,
  onFinish,
}) => {
  const t = useTranslate();
  const breakpoint = Grid.useBreakpoint();
  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [wards, setWards] = useState<IWard[]>([]);

  const provinceId = Form.useWatch("provinceId", formProps.form);
  const districtId = Form.useWatch("districtId", formProps.form);
  const [provinceName, setProvinceName] = useState(
    formProps.form?.getFieldValue("provinceName")
  );
  const [districtName, setDistrictName] = useState(
    formProps.form?.getFieldValue("districtName")
  );
  const [wardName, setWardName] = useState(
    formProps.form?.getFieldValue("wardName")
  );

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
      customer: formProps.form?.getFieldValue("customer").id,
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
      title="Cập nhật địa chỉ"
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
                      required: true,
                      whitespace: true,
                    },
                  ]}
                >
                  <input type="text" />
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
                      required: true,
                    },
                  ]}
                >
                  {provinces.length > 0 ? (
                    <select onChange={handleProvinceChange}>
                      <option value="">--Chọn tỉnh/thành phố--</option>
                      {provinces.map((province, index) => (
                        <option key={index} value={province.ProvinceID}>
                          {province.ProvinceName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select>
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
                      required: true,
                    },
                  ]}
                >
                  {districts.length > 0 ? (
                    <select onChange={handleDistrictChange}>
                      <option value="">--Chọn quận/huyện--</option>
                      {districts.map((district, index) => (
                        <option key={index} value={district.DistrictID}>
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
            <div className="col-12">
              <div className="billing-select mb-20">
                <label>Phường/xã</label>
                <Form.Item
                  name="wardCode"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
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
            <div className="col-12">
              <div className="billing-info mb-20">
                <label>Chi tiết địa chỉ</label>
                <Form.Item
                  name="more"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <input type="text" />
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

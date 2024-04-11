import { LoadingOutlined } from "@ant-design/icons";
import { useCustom, useTranslate } from "@refinedev/core";
import { Form, FormProps, Grid, Modal, ModalProps } from "antd";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { IDistrict, IProvince, IWard } from "../../interfaces";
import { validateCommon, validatePhoneNumber } from "../../helpers/validate";

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
      title={t("my_account.address.labels.edit")}
    >
      <Form {...formProps} onFinish={onFinishHandler}>
        <div className="billing-info-wrap">
          <div className="row">
            <div className="col-12">
              <div className="billing-info mb-20">
                <label>
                  <span style={{ color: "red" }}>*</span>{" "}
                  {t("my_account.address.fields.phoneNumber")}
                </label>
                <Form.Item
                  name="phoneNumber"
                  required
                  rules={[
                    {
                      validator: validatePhoneNumber,
                    },
                  ]}
                >
                  <input type="text" />
                </Form.Item>
              </div>
            </div>
            <div className="col-12">
              <div className="billing-select mb-20">
                <label>
                  <span style={{ color: "red" }}>*</span>{" "}
                  {t("my_account.address.fields.province.title")}
                </label>
                <Form.Item
                  name="provinceId"
                  required
                  rules={[
                    {
                      validator: (_, value) =>
                        validateCommon(_, value, t, "provinceId"),
                    },
                  ]}
                >
                  {provinces ? (
                    <select onChange={handleProvinceChange}>
                      <option value="">
                        --{t("my_account.address.fields.province.place_holder")}
                        --
                      </option>{" "}
                      {provinces &&
                        provinces.map((province, index) => (
                          <option key={index} value={province.ProvinceID}>
                            {province.ProvinceName}
                          </option>
                        ))}
                    </select>
                  ) : (
                    <select>
                      <option value="">Loading...</option>
                    </select>
                  )}
                </Form.Item>
              </div>
            </div>
            <div className="col-12">
              <div className="billing-select mb-20">
                <label>
                  <span style={{ color: "red" }}>*</span>{" "}
                  {t("my_account.address.fields.district.title")}
                </label>{" "}
                <Form.Item
                  name="districtId"
                  required
                  rules={[
                    {
                      validator: (_, value) =>
                        validateCommon(_, value, t, "districtId"),
                    },
                  ]}
                >
                  {districts.length > 0 ? (
                    <select onChange={handleDistrictChange}>
                      <option value="">
                        --{t("my_account.address.fields.district.place_holder")}
                        --
                      </option>
                      {districts &&
                        districts.map((district, index) => (
                          <option key={index} value={district.DistrictID}>
                            {district.DistrictName}
                          </option>
                        ))}
                    </select>
                  ) : (
                    <select>
                      <option value="">Loading...</option>
                    </select>
                  )}
                </Form.Item>
              </div>
            </div>
            <div className="col-12">
              <div className="billing-select mb-20">
                <label>
                  <span style={{ color: "red" }}>*</span>{" "}
                  {t("my_account.address.fields.ward.title")}
                </label>
                <Form.Item
                  name="wardCode"
                  required
                  rules={[
                    {
                      validator: (_, value) =>
                        validateCommon(_, value, t, "wardCode"),
                    },
                  ]}
                >
                  {wards ? (
                    <select onChange={handleWardChange}>
                      <option value="">
                        --{t("my_account.address.fields.ward.place_holder")}--
                      </option>
                      {wards &&
                        wards.map((ward, index) => (
                          <option key={index} value={ward.WardCode}>
                            {ward.WardName}
                          </option>
                        ))}
                    </select>
                  ) : (
                    <select>
                      <option value="">Loading...</option>
                    </select>
                  )}
                </Form.Item>
              </div>
            </div>
            <div className="col-12">
              <div className="billing-info mb-20">
                <label>
                  <span style={{ color: "red" }}>*</span>{" "}
                  {t("my_account.address.fields.more")}
                </label>
                <Form.Item
                  name="more"
                  required
                  rules={[
                    {
                      validator: (_, value) =>
                        validateCommon(_, value, t, "more"),
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
                {t("buttons.save_changes")}
              </button>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

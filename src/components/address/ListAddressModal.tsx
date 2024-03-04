import { EditOutlined } from "@ant-design/icons";
import { useModalForm } from "@refinedev/antd";
import {
  useApiUrl,
  useCustom,
  useCustomMutation,
  useNotification,
  useTranslate,
} from "@refinedev/core";
import {
  List as AntdList,
  Button,
  Col,
  FormInstance,
  Grid,
  Modal,
  ModalProps,
  Row,
  Space,
  Tag,
  Tooltip,
} from "antd";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  IAddressResponse,
  ICustomerResponse,
  IOrderRequest,
} from "../../interfaces";
import { RootState } from "../../redux/store";
import { CreateAddressModal } from "./CreateAddressModal";
import { EditAddressModal } from "./EditAddressModal";

type ListAddressModalProps = {
  modalProps: ModalProps;
  close: () => void;
  customer: ICustomerResponse | undefined;
  setAddresses?: (order: IOrderRequest) => void;
  form?: FormInstance<any>;
};

export const ListAddressModal: React.FC<ListAddressModalProps> = ({
  modalProps,
  customer,
  close,
  setAddresses: setViewAddress,
  form,
}) => {
  const t = useTranslate();
  const breakpoint = Grid.useBreakpoint();
  const API_URL = useApiUrl();
  const { open } = useNotification();
  const [addresses, setAddresses] = useState<IAddressResponse[]>([]);

  const { mutate: setDefault } = useCustomMutation<IAddressResponse>();
  const { order } = useSelector((state: RootState) => state.order);

  function handleAddressSetDefault(id: string) {
    const apiUrl = `${API_URL}/addresses/set-default-address?address=${id}`;

    setDefault(
      {
        url: apiUrl,
        method: "put",
        values: { address: id },
        successNotification: () => ({
          message: "Đặt mặc định thành công.",
          description: "Thành công",
          type: "success",
        }),
        errorNotification: () => ({
          message: "Có lỗi xảy ra khi đặt địa chỉ mặc định",
          description: "Lỗi",
          type: "error",
        }),
      },
      {
        onSuccess: () => {
          refetchAddress();
        },
      }
    );
  }

  function renderItem(item: IAddressResponse) {
    const {
      id,
      provinceName,
      districtName,
      wardName,
      more,
      phoneNumber,
      isDefault,
      provinceId,
      districtId,
      wardCode,
    } = item;
    const defaultTag = isDefault ? <Tag color="green">Mặc định</Tag> : null;

    return (
      <AntdList.Item
        actions={[
          <Space size="small" key={id}>
            <Tooltip title="Sửa">
              <Button
                style={{ color: "#52c41a", borderColor: "#52c41a" }}
                size="small"
                icon={<EditOutlined />}
                onClick={() => editModalShow(id)}
              />
            </Tooltip>
            <Button
              disabled={isDefault}
              size="small"
              onClick={() => {
                handleAddressSetDefault(id);
              }}
            >
              Đặt mặc định
            </Button>
            <Button
              size="small"
              onClick={() => {
                const newOrder = _.cloneDeep({
                  ...order,
                  phoneNumber: phoneNumber,
                  address: {
                    ...order.address,
                    phoneNumber: phoneNumber,
                    provinceName: provinceName,
                    districtName: districtName,
                    wardName: wardName,
                    provinceId: provinceId,
                    districtId: districtId,
                    wardCode: wardCode,
                    more: more,
                  },
                });
                if (!setViewAddress) {
                  form?.setFieldsValue({
                    phone_number: phoneNumber,
                    provinceName: provinceName,
                    districtName: districtName,
                    wardName: wardName,
                    provinceId: provinceId,
                    districtId: districtId,
                    wardCode: wardCode,
                    line: more,
                  });
                  open?.({
                    type: "success",
                    message: "Chọn địa chỉ thành công",
                    description: "Thành công",
                  });
                } else {
                  setViewAddress(newOrder);
                }
                close();
              }}
            >
              Chọn
            </Button>
          </Space>,
        ]}
      >
        <AntdList.Item.Meta
          title={
            <>
              {customer?.fullName} | {phoneNumber} {defaultTag}
            </>
          }
          description={`${more}, ${wardName}, ${districtName}, ${provinceName}`}
        />
      </AntdList.Item>
    );
  }

  const { refetch: refetchAddress, isLoading } = useCustom<IAddressResponse[]>({
    url: `${API_URL}/addresses`,
    method: "get",
    config: {
      filters: [
        {
          field: "customer",
          operator: "eq",
          value: customer?.id,
        },
      ],
    },
    queryOptions: {
      enabled: false,
      onSuccess: (data: any) => {
        const response = data.response.content.data;
        setAddresses(response);
      },
    },
  });

  useEffect(() => {
    if (modalProps.open) {
      setAddresses([]);
      refetchAddress();
    }
  }, [modalProps.open]);

  const {
    modalProps: createModalProps,
    formProps: createFormProps,
    show: createModalShow,
    onFinish: createOnFinish,
    close: createModalClose,
  } = useModalForm<IAddressResponse>({
    resource: "addresses",
    onMutationSuccess: () => {
      createFormProps.form?.resetFields();
      refetchAddress().then(() => {
        createModalClose();
      });
    },
    autoSubmitClose: true,
    autoResetForm: true,
    action: "create",
    redirect: false,
    warnWhenUnsavedChanges: false,
    successNotification: (data: any, values) => {
      return {
        message: "Tạo địa chỉ mới thành công",
        description: "Thành công",
        type: "success",
      };
    },
    errorNotification: (error, values) => {
      return {
        message: `Đã xảy ra lỗi khi tạo địa chỉ`,
        description: "Lỗi: " + error?.message,
        type: "error",
      };
    },
  });

  const {
    modalProps: editModalProps,
    formProps: editFormProps,
    show: editModalShow,
    onFinish: editOnFinish,
    close: editModalClose,
  } = useModalForm<IAddressResponse>({
    resource: "addresses",
    onMutationSuccess: () => {
      refetchAddress().then(() => {
        editModalClose();
      });
    },
    action: "edit",
    redirect: false,
    autoSubmitClose: true,
    warnWhenUnsavedChanges: false,
    successNotification: (data: any, values) => {
      return {
        message: "Cập nhật địa chỉ mới thành công",
        description: "Thành công",
        type: "success",
      };
    },
    errorNotification: (error, values) => {
      return {
        message: `Đã xảy ra lỗi khi Cập nhật địa chỉ`,
        description: "Lỗi: " + error?.message,
        type: "error",
      };
    },
  });

  return (
    <Modal
      title="Danh sách địa chỉ của bạn"
      {...modalProps}
      open={modalProps.open}
      width={breakpoint.sm ? "700px" : "100%"}
      zIndex={1001}
      footer={<></>}
    >
      <Row gutter={[16, 24]}>
        <Col span={24} className="text-end">
          <Button
            onClick={() => {
              createFormProps.form?.resetFields();
              createModalShow();
            }}
          >
            Tạo địa chỉ mới
          </Button>
        </Col>
        <Col span={24}>
          <AntdList
            bordered
            itemLayout="horizontal"
            dataSource={addresses}
            renderItem={renderItem}
            loading={isLoading}
          />
        </Col>
      </Row>
      <CreateAddressModal
        onFinish={createOnFinish}
        modalProps={createModalProps}
        formProps={createFormProps}
        customer={customer}
      />
      <EditAddressModal
        onFinish={editOnFinish}
        modalProps={editModalProps}
        formProps={editFormProps}
      />
    </Modal>
  );
};

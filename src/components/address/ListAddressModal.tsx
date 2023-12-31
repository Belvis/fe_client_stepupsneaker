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
  Grid,
  Modal,
  ModalProps,
  Row,
  Space,
  Tag,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IAddressResponse, ICustomerResponse } from "../../interfaces";
import { setOrder } from "../../redux/slices/order-slice";
import { RootState } from "../../redux/store";
import { CreateAddressModal } from "./CreateAddressModal";
import { EditAddressModal } from "./EditAddressModal";

type ListAddressModalProps = {
  modalProps: ModalProps;
  close: () => void;
  customer: ICustomerResponse | undefined;
};

export const ListAddressModal: React.FC<ListAddressModalProps> = ({
  modalProps,
  customer,
  close,
}) => {
  const t = useTranslate();
  const breakpoint = Grid.useBreakpoint();
  const API_URL = useApiUrl();
  const { open } = useNotification();
  const [addresses, setAddresses] = useState<IAddressResponse[]>([]);

  const { mutate: setDefault } = useCustomMutation<IAddressResponse>();
  const dispatch = useDispatch();
  const { order } = useSelector((state: RootState) => state.order);

  function handleAddressSetDefault(id: string) {
    const apiUrl = `${API_URL}/addresses/set-default-address?address=${id}`;

    setDefault(
      {
        url: apiUrl,
        method: "put",
        values: { address: id },
        successNotification: () => ({
          message: "Successfully set default.",
          description: "Success with no errors",
          type: "success",
        }),
        errorNotification: () => ({
          message: "Something went wrong when setting default address",
          description: "Error",
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
                dispatch(
                  setOrder({
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
                    //   shippingMoney: data?.response.data.total as number,
                  })
                );
                open?.({
                  type: "success",
                  message: "Chọn địa chỉ thành công",
                  description: "Thành công",
                });
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

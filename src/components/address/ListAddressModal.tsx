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
          message: t("my_account.address.messages.set_default"),
          description: t("common.success"),
          type: "success",
        }),
        errorNotification: (error, values, resource) => {
          return {
            message: t("common.error") + error?.message,
            description: "Oops...",
            type: "error",
          };
        },
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
    const defaultTag = isDefault ? (
      <Tag color="green">{t("my_account.address.labels.default")}</Tag>
    ) : null;

    return (
      <AntdList.Item
        actions={[
          <Space size="small" key={id}>
            <Tooltip title={t("my_account.address.buttons.edit")}>
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
              {t("my_account.address.buttons.set_default")}
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
                    message: t("my_account.address.messages.choose"),
                    description: t("common.success"),
                  });
                } else {
                  setViewAddress(newOrder);
                }
                close();
              }}
            >
              {t("buttons.choose")}
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
        message: t("my_account.address.messages.create"),
        description: t("common.success"),
        type: "success",
      };
    },
    errorNotification: (error, values) => {
      return {
        message: t("common.error") + error?.message,
        description: "Oops...",
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
        message: t("common.update.success"),
        description: t("common.success"),
        type: "success",
      };
    },
    errorNotification: (error, values) => {
      return {
        message: t("common.error") + error?.message,
        description: "Oops...",
        type: "error",
      };
    },
  });

  return (
    <Modal
      title={t("my_account.address.labels.list")}
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
            {t("my_account.address.buttons.create")}
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

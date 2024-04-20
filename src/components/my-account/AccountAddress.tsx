import { useModalForm } from "@refinedev/antd";
import {
  useApiUrl,
  useCustomMutation,
  useDelete,
  useTranslate,
} from "@refinedev/core";
import { Badge } from "antd";
import { Accordion } from "react-bootstrap";
import { IAddressResponse, ICustomerResponse } from "../../interfaces";
import { CreateAddressModal } from "../address/CreateAddressModal";
import { EditAddressModal } from "../address/EditAddressModal";

type AccountAddressProps = {
  data: ICustomerResponse | undefined;
  refetch: any;
};

const AccountAddress: React.FC<AccountAddressProps> = ({ data, refetch }) => {
  const t = useTranslate();
  const API_URL = useApiUrl();
  const { mutate: remove } = useDelete();
  const { mutate: setDefault } = useCustomMutation<IAddressResponse>();

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
        errorNotification: (error) => ({
          message: t("common.error") + error?.message,
          description: "Oops...",
          type: "error",
        }),
      },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  }

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
      refetch().then(() => {
        createModalClose();
      });
    },
    autoSubmitClose: true,
    autoResetForm: true,
    action: "create",
    redirect: false,
    warnWhenUnsavedChanges: false,
    successNotification: (data, values, resource) => {
      return {
        message: t("my_account.address.messages.create"),
        description: t("common.success"),
        type: "success",
      };
    },
    errorNotification: (error) => ({
      message: t("common.error") + error?.message,
      description: "Oops...",
      type: "error",
    }),
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
      refetch().then(() => {
        editModalClose();
      });
    },
    action: "edit",
    redirect: false,
    autoSubmitClose: true,
    warnWhenUnsavedChanges: false,
    successNotification: (data, values, resource) => {
      return {
        message: t("common.update.success"),
        description: t("common.success"),
        type: "success",
      };
    },
    errorNotification: (error) => ({
      message: t("common.error") + error?.message,
      description: "Oops...",
      type: "error",
    }),
  });

  const removeAddress = (id: string) => {
    remove(
      {
        resource: "addresses",
        id,
        successNotification: (data, values, resource) => {
          return {
            message: t("common.update.success"),
            description: t("common.success"),
            type: "success",
          };
        },
        errorNotification: (error) => ({
          message: t("common.error") + error?.message,
          description: "Oops...",
          type: "error",
        }),
      },
      {
        onError: (error, variables, context) => {},
        onSuccess: (data, variables, context) => {
          refetch();
        },
      }
    );
  };

  return (
    <Accordion.Item eventKey="2" className="single-my-account mb-20">
      <Accordion.Header className="panel-heading">
        <span>3 .</span> {t("my_account.address.title")}
      </Accordion.Header>
      <Accordion.Body>
        <div className="myaccount-info-wrapper">
          <div className="account-info-wrapper row">
            <div className="col">
              <h5>{t("my_account.address.labels.list")}</h5>
            </div>
            <div className="col text-end">
              <button
                onClick={() => {
                  createFormProps.form?.resetFields();
                  createModalShow();
                }}
              >
                {t("my_account.address.buttons.create")}
              </button>
            </div>
          </div>
          {data && data.addressList
            ? data.addressList
                .sort((a, b) =>
                  a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1
                )
                .map((address) => {
                  const {
                    phoneNumber,
                    provinceName,
                    districtName,
                    wardName,
                    more,
                    isDefault,
                    id,
                  } = address;

                  return (
                    <div className="entries-wrapper mb-3" key={id}>
                      <Badge.Ribbon
                        key={id}
                        text={t("my_account.address.labels.default")}
                        placement="start"
                        color="green"
                        style={{
                          display: isDefault ? "" : "none",
                        }}
                      >
                        <div className="row">
                          <div className="col-lg-6 col-md-6 d-flex align-items-center">
                            <div className="entries-info">
                              <div className="row">
                                <div className="col fw-bold">
                                  {t("my_account.address.fields.phoneNumber")}:
                                </div>
                                <div className="col text-end">
                                  {phoneNumber}
                                </div>
                              </div>
                              <div className="row">
                                <div className="col fw-bold">
                                  {t(
                                    "my_account.address.fields.province.title"
                                  )}
                                  :
                                </div>
                                <div className="col text-end">
                                  {provinceName}
                                </div>
                              </div>
                              <div className="row">
                                <div className="col fw-bold">
                                  {t(
                                    "my_account.address.fields.district.title"
                                  )}
                                  :
                                </div>
                                <div className="col text-end">
                                  {districtName}
                                </div>
                              </div>
                              <div className="row">
                                <div className="col fw-bold">
                                  {t("my_account.address.fields.ward.title")}:
                                </div>
                                <div className="col text-end">{wardName}</div>
                              </div>
                              <div className="row">
                                <div className="col fw-bold">
                                  {t("my_account.address.fields.more")}:
                                </div>
                                <div className="col text-end">{more}</div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center">
                            <div className="entries-edit-delete text-center">
                              <button
                                className="edit"
                                onClick={() => editModalShow(id)}
                              >
                                {t("my_account.address.buttons.edit")}
                              </button>
                              <button
                                className="edit"
                                onClick={() => handleAddressSetDefault(id)}
                                disabled={isDefault}
                              >
                                {t("my_account.address.buttons.set_default")}
                              </button>
                              <button onClick={() => removeAddress(id)}>
                                {t("my_account.address.buttons.delete")}
                              </button>
                            </div>
                          </div>
                        </div>
                      </Badge.Ribbon>
                    </div>
                  );
                })
            : t("my_account.address.messages.empty")}
        </div>
      </Accordion.Body>
      <CreateAddressModal
        onFinish={createOnFinish}
        modalProps={createModalProps}
        formProps={createFormProps}
        customer={data}
      />
      <EditAddressModal
        onFinish={editOnFinish}
        modalProps={editModalProps}
        formProps={editFormProps}
      />
    </Accordion.Item>
  );
};

export default AccountAddress;

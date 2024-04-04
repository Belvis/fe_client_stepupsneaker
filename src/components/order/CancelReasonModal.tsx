import { InfoCircleOutlined } from "@ant-design/icons";
import { HttpError, useOne, useTranslate, useUpdate } from "@refinedev/core";
import {
  Input,
  Modal,
  ModalProps,
  Radio,
  RadioChangeEvent,
  Space,
  Spin,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { showWarningConfirmDialog } from "../../helpers/confirm";
import { IOrderResponse } from "../../interfaces";
import { RootState } from "../../redux/store";

interface CancelReasonModalProps {
  restModalProps: ModalProps;
  code: string | undefined;
  callBack: any;
  close: () => void;
}

const { Title } = Typography;

const CancelReasonModal: React.FC<CancelReasonModalProps> = ({
  restModalProps,
  code,
  callBack,
  close,
}) => {
  const t = useTranslate();
  const currency = useSelector((state: RootState) => state.currency);

  const { mutate: update, isLoading: isLoadingUpdate } = useUpdate();
  const { data, isLoading, isError } = useOne<IOrderResponse, HttpError>({
    resource: "orders/tracking",
    id: code,
  });

  const order = data?.data ? data?.data : ({} as IOrderResponse);

  const [value, setValue] = useState(1);

  const [selectedReason, setSelectedReason] = useState("Khác");

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    if (value && value !== 6) {
      setSelectedReason(() => {
        switch (value) {
          case 1:
            return t("order_tracking.cancel.cases.1");
          case 2:
            return t("order_tracking.cancel.cases.2");
          case 3:
            return t("order_tracking.cancel.cases.3");
          case 4:
            return t("order_tracking.cancel.cases.4");
          case 5:
            return t("order_tracking.cancel.cases.5");
          default:
            return "";
        }
      });
    }
  }, [value]);

  const handleOk = () => {
    showWarningConfirmDialog({
      options: {
        accept: () => {
          update(
            {
              resource: `orders/cancel`,
              values: {
                orderHistoryNote: selectedReason,
              },
              id: order.code,
              successNotification: (data, values, resource) => {
                return {
                  message: t("order_tracking.messages.success"),
                  description: t("common.success"),
                  type: "success",
                };
              },
              errorNotification: (error, values, resource) => {
                return {
                  message: t("common.error") + error?.message,
                  description: "Oops...",
                  type: "error",
                };
              },
            },
            {
              onError: (error, variables, context) => {},
              onSuccess: (data, variables, context) => {
                callBack();
                close();
              },
            }
          );
        },
        reject: () => {},
      },
      t: t,
    });
  };

  return (
    <Modal
      title={
        <Space align="baseline">
          <Title level={5}>{t("order_tracking.cancel.title")}</Title>
          <Tooltip title={t("order_tracking.cancel.subtitle")}>
            <InfoCircleOutlined />
          </Tooltip>
        </Space>
      }
      {...restModalProps}
      open={restModalProps.open}
      width="500px"
      centered
      onOk={handleOk}
    >
      <Spin spinning={isLoading}>
        <Radio.Group onChange={onChange} value={value}>
          <Space direction="vertical" size="large">
            <Radio value={1}>{t("order_tracking.cancel.cases.1")}</Radio>
            <Radio value={2}>{t("order_tracking.cancel.cases.2")}</Radio>
            <Radio value={3}>{t("order_tracking.cancel.cases.3")}</Radio>
            <Radio value={4}>{t("order_tracking.cancel.cases.4")}</Radio>
            <Radio value={5}>{t("order_tracking.cancel.cases.5")}</Radio>
            <Radio value={6}>
              {t("order_tracking.cancel.cases.other")}
              {value === 6 ? (
                <Input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const { value: inputValue } = e.target;
                    setSelectedReason(inputValue);
                  }}
                  style={{ width: 200, marginLeft: 10 }}
                />
              ) : null}
            </Radio>
          </Space>
        </Radio.Group>
      </Spin>
    </Modal>
  );
};

export default CancelReasonModal;

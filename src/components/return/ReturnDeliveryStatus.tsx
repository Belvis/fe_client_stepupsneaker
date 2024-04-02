import { useTranslate } from "@refinedev/core";
import { Tag } from "antd";
import { DeliveryStatus } from "../../interfaces";

type ReturnDeliveryStatusProps = {
  status: DeliveryStatus;
};

export const ReturnDeliveryStatus: React.FC<ReturnDeliveryStatusProps> = ({
  status,
}) => {
  const t = useTranslate();
  let color;

  switch (status) {
    case "PENDING":
      color = "orange";
      break;
    case "RETURNING":
      color = "cyan";
      break;
    case "RECEIVED":
      color = "green";
      break;
    case "COMPLETED":
      color = "blue";
      break;
  }

  return (
    <Tag color={color}>
      {t(`return-forms.fields.returnDeliveryStatus.${status}`)}
    </Tag>
  );
};

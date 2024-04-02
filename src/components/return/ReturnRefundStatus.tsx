import { useTranslate } from "@refinedev/core";
import { Tag } from "antd";
import { RefundStatus } from "../../interfaces";

type ReturnRefundStatusProps = {
  status: RefundStatus;
};

export const ReturnRefundStatus: React.FC<ReturnRefundStatusProps> = ({
  status,
}) => {
  const t = useTranslate();
  let color;

  switch (status) {
    case "PENDING":
      color = "orange";
      break;
    case "COMPLETED":
      color = "blue";
      break;
  }

  return (
    <Tag color={color}>{t(`return-forms.fields.refundStatus.${status}`)}</Tag>
  );
};

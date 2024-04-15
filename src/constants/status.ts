import { TranslateFunction } from "../interfaces";

export const getProductStatusOptions = (t: TranslateFunction) => [
  {
    label: t("enum.productStatuses.ACTIVE"),
    value: "ACTIVE",
  },
  {
    label: t("enum.productStatuses.IN_ACTIVE"),
    value: "IN_ACTIVE",
  },
];

export const getCustomerStatusOptions = (t: TranslateFunction) => [
  {
    label: t("enum.customerStatuses.ACTIVE"),
    value: "ACTIVE",
  },
  {
    label: t("enum.customerStatuses.IN_ACTIVE"),
    value: "IN_ACTIVE",
  },
  {
    label: t("enum.customerStatuses.BLOCKED"),
    value: "BLOCKED",
  },
];

export const getVoucherStatusOptions = (t: TranslateFunction) => [
  {
    label: t("enum.vouchersStatuses.ACTIVE"),
    value: "ACTIVE",
  },
  {
    label: t("enum.vouchersStatuses.IN_ACTIVE"),
    value: "IN_ACTIVE",
  },
  {
    label: t("enum.vouchersStatuses.EXPIRED"),
    value: "EXPIRED",
  },
  {
    label: t("enum.vouchersStatuses.UP_COMING"),
    value: "UP_COMING",
  },
  {
    label: t("enum.vouchersStatuses.CANCELLED"),
    value: "CANCELLED",
  },
];

export const getPromotionStatusOptions = (t: TranslateFunction) => [
  {
    label: t("enum.promotionsStatuses.ACTIVE"),
    value: "ACTIVE",
  },
  {
    label: t("enum.promotionsStatuses.IN_ACTIVE"),
    value: "IN_ACTIVE",
  },
  {
    label: t("enum.promotionsStatuses.EXPIRED"),
    value: "EXPIRED",
  },
  {
    label: t("enum.promotionsStatuses.CANCELLED"),
    value: "CANCELLED",
  },
  {
    label: t("enum.promotionsStatuses.UP_COMING"),
    value: "UP_COMING",
  },
];

export const getOrderStatusOptions = (t: TranslateFunction) => [
  {
    label: t("enum.orderStatuses.PENDING"),
    value: "PENDING",
  },
  {
    label: t("enum.orderStatuses.WAIT_FOR_CONFIRMATION"),
    value: "WAIT_FOR_CONFIRMATION",
  },
  {
    label: t("enum.orderStatuses.WAIT_FOR_DELIVERY"),
    value: "WAIT_FOR_DELIVERY",
  },
  {
    label: t("enum.orderStatuses.DELIVERING"),
    value: "DELIVERING",
  },
  {
    label: t("enum.orderStatuses.COMPLETED"),
    value: "COMPLETED",
  },
  {
    label: t("enum.orderStatuses.CANCELED"),
    value: "CANCELED",
  },
  {
    label: t("enum.orderStatuses.EXPIRED"),
    value: "EXPIRED",
  },
  {
    label: t("enum.orderStatuses.RETURNED"),
    value: "RETURNED",
  },
  {
    label: t("enum.orderStatuses.EXCHANGED"),
    value: "EXCHANGED",
  },
];

export const getDeliveryStatusOptions = (t: TranslateFunction) => [
  {
    label: t("return-forms.fields.returnDeliveryStatus.PENDING"),
    value: "PENDING",
  },
  {
    label: t("return-forms.fields.returnDeliveryStatus.RETURNING"),
    value: "RETURNING",
  },
  {
    label: t("return-forms.fields.returnDeliveryStatus.RECEIVED"),
    value: "RECEIVED",
  },
  {
    label: t("return-forms.fields.returnDeliveryStatus.COMPLETED"),
    value: "COMPLETED",
  },
];

export const getRefundStatusOptions = (t: TranslateFunction) => [
  {
    label: t("return-forms.fields.refundStatus.PENDING"),
    value: "PENDING",
  },
  {
    label: t("return-forms.fields.refundStatus.COMPLETED"),
    value: "COMPLETED",
  },
];

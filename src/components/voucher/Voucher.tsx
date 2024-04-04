import { Card, Col, Image, Row } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { CurrencyFormatter } from "../../helpers/currency";
import { showErrorToast, showSuccessToast } from "../../helpers/toast";
import { IOrderResponse, IVoucherResponse } from "../../interfaces";
import { CurrencyState } from "../../redux/slices/currency-slice";
import { useDispatch, useSelector } from "react-redux";
import { setOrder } from "../../redux/slices/order-slice";
import { RootState } from "../../redux/store";
import { calculateTotalPrice } from "../../helpers/cart";
import { useTranslate } from "@refinedev/core";

interface VoucherProps {
  item: IVoucherResponse;
  currency: CurrencyState;
  type?: "apply" | "copy";
  setViewOrder?: React.Dispatch<React.SetStateAction<IOrderResponse>>;
  close?: () => void;
}

const Voucher: React.FC<VoucherProps> = ({
  item,
  currency,
  type,
  setViewOrder,
  close,
}) => {
  const t = useTranslate();
  const dispatch = useDispatch();
  const { order } = useSelector((state: RootState) => state.order);
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const { image, endDate, value, type: voucherType, constraint, code } = item;

  const [message, setMessage] = useState<string>(t("common.use_now"));

  const cashPrice =
    voucherType === "CASH" ? (
      <CurrencyFormatter
        value={value * currency.currencyRate}
        currency={currency}
      />
    ) : (
      <>{value}%</>
    );

  const constraintPrice = (
    <CurrencyFormatter
      value={constraint * currency.currencyRate}
      currency={currency}
    />
  );

  const handleCopyCode = () => {
    if (code) {
      navigator.clipboard.writeText(code).then(() => {
        showSuccessToast(t("common.copied"));
      });
      setMessage(code);
      setTimeout(() => {
        setMessage(t("common.use_now"));
      }, 3000);
    }
  };

  const handleApplyVoucher = () => {
    if (type === "apply" && close) {
      if (setViewOrder) {
        setViewOrder((prev) => {
          if (prev.originMoney > item.constraint) {
            return {
              ...prev,
              voucher: item,
            };
          } else {
            showErrorToast(t("cart.voucher.messages.unqualified"));
            return prev;
          }
        });
      } else {
        if (calculateTotalPrice(cartItems) >= item.constraint) {
          dispatch(
            setOrder({
              ...order,
              voucher: item,
            })
          );
        } else {
          return showErrorToast(t("cart.voucher.messages.unqualified"));
        }
      }

      close();
      showSuccessToast(t("cart.voucher.messages.success"));
    } else {
      showErrorToast(t("cart.voucher.messages.invalid"));
    }
  };

  return (
    <Card
      style={{
        borderColor: "transparent",
        boxShadow:
          "0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09)",
      }}
    >
      <Row gutter={16} align="middle">
        <Col span={6} style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              zIndex: 2,
              width: "50%",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Image
              preview={false}
              src={
                image ? image : "/images/voucher/voucher-coupon-svgrepo-com.png"
              }
            />
          </div>
          <Image preview={false} src="/images/voucher/subtract-xRJ.png" />
        </Col>
        <Col span={18}>
          <Row>
            <Col span={16}>
              <div className="auto-group-xh3i-y16">
                <div className="group-3-WFv">
                  <p className="gim-1000000-ed2">
                    {t("cart.voucher.modal.antd_list.reduce")} {cashPrice}
                  </p>
                  <p className="cc-ruy-to-qqv">
                    {t("cart.voucher.modal.antd_list.for_order_above")}{" "}
                    {constraintPrice}
                  </p>
                </div>
                <p className="c-hiu-lc-n-12102024-xfe">
                  {t("cart.voucher.modal.antd_list.valid_til")}:{" "}
                  {dayjs(new Date(endDate)).format("LLL")}
                </p>
                <p className="chi-tit--Fue">
                  {t("cart.voucher.modal.antd_list.detail")} &gt;&gt;&gt;
                </p>
              </div>{" "}
            </Col>
            <Col
              span={8}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-end",
                paddingRight: "1rem",
              }}
            >
              <div className="sharpen-btn" style={{ width: "100%" }}>
                <button
                  onClick={
                    type === "copy" ? handleCopyCode : handleApplyVoucher
                  }
                  style={{ width: "100%" }}
                >
                  {message}
                </button>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default Voucher;

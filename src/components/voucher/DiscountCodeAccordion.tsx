import { ContainerOutlined } from "@ant-design/icons";
import { useModal } from "@refinedev/antd";
import { useApiUrl, useNotification } from "@refinedev/core";
import { Space, Tooltip } from "antd";
import _ from "lodash";
import React, { Fragment, useState } from "react";
import { Accordion } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { dataProvider } from "../../providers/dataProvider";
import { calculateTotalPrice } from "../../helpers/cart";
import { showErrorToast, showSuccessToast } from "../../helpers/toast";
import { IVoucherList, IVoucherResponse } from "../../interfaces";
import { setOrder } from "../../redux/slices/order-slice";
import { RootState } from "../../redux/store";
import VoucherModal from "./VoucherModal";

interface DiscountCodeAccordionProps {
  totalMoney: number;
  vouchers: IVoucherList[];
}

const DiscountCodeAccordion: React.FC<DiscountCodeAccordionProps> = ({
  totalMoney,
  vouchers,
}) => {
  const { t } = useTranslation();
  const API_URL = useApiUrl();
  const dispatch = useDispatch();
  const { order } = useSelector((state: RootState) => state.order);
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const { open } = useNotification();
  const { getOne } = dataProvider(API_URL);
  const [voucherCode, setVoucherCode] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVoucherCode(e.target.value);
  };

  const getTopVoucher = () => {
    const convertedLegitVoucher = _.cloneDeep(vouchers);
    convertedLegitVoucher.map((single) => {
      const updatedVoucher = { ...single };
      if (single.voucher.type === "PERCENTAGE") {
        updatedVoucher.voucher.value =
          (single.voucher.value * totalMoney) / 100;
      }
      return updatedVoucher;
    });

    convertedLegitVoucher.sort((a, b) => b.voucher.value - a.voucher.value);

    return convertedLegitVoucher.length > 0
      ? convertedLegitVoucher[0].voucher.code
      : "";
  };

  const applyVoucher = async (event: React.FormEvent) => {
    try {
      event.preventDefault();

      if (!voucherCode.trim()) {
        showErrorToast("Vui lòng nhập mã giảm giá");
        return;
      }

      const { data } = await getOne<IVoucherResponse>({
        resource: "vouchers/code",
        id: voucherCode,
      });

      const voucher = data ?? ({} as IVoucherResponse);

      if (voucher) {
        if (calculateTotalPrice(cartItems) >= voucher.constraint) {
          dispatch(
            setOrder({
              ...order,
              voucher: voucher,
            })
          );
          return showSuccessToast("Áp dụng voucher thành công");
        } else {
          return showErrorToast(
            "Đơn hàng chưa đủ điều kiện để được áp dụng giảm giá"
          );
        }
      } else {
        return showErrorToast("Voucher không hợp lệ");
      }
    } catch (error: any) {
      return showErrorToast("Voucher không hợp lệ");
    }
  };

  const {
    show,
    close,
    modalProps: { visible, ...restModalProps },
  } = useModal();

  return (
    <Fragment>
      <Accordion>
        <Accordion.Item eventKey="0" className="single-my-account mb-20">
          <Accordion.Header className="panel-heading">
            Bạn có mã giảm giá? Sử dụng tại đây.
          </Accordion.Header>
          <Accordion.Body style={{ padding: 0 }}>
            <div className="checkout-discount-code-wrapper">
              <div className="title-wrap">
                <h4 className="cart-bottom-title section-bg-gray">
                  {t("cart.voucher.title")}
                </h4>
              </div>

              <div className="discount-code">
                <p>{t("cart.voucher.subtitle")}</p>
                <div className="discount-form">
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={handleChange}
                    placeholder={getTopVoucher()}
                  />
                  <Space>
                    <button className="cart-btn-2" onClick={applyVoucher}>
                      {t("cart.buttons.apply_voucher")}
                    </button>
                    <Tooltip title="Xem voucher">
                      <button
                        className="cart-btn-3"
                        type="button"
                        onClick={show}
                      >
                        <ContainerOutlined />
                      </button>
                    </Tooltip>
                  </Space>
                </div>
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <VoucherModal
        restModalProps={restModalProps}
        vouchers={vouchers}
        type="apply"
        close={close}
      />
    </Fragment>
  );
};

export default DiscountCodeAccordion;

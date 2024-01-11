import React, { Fragment, useState } from "react";
import { Space, Tooltip } from "antd";
import { ContainerOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Accordion } from "react-bootstrap";
import {
  HttpError,
  useApiUrl,
  useList,
  useNotification,
  useOne,
} from "@refinedev/core";
import { IVoucherResponse } from "../../interfaces";
import { dataProvider } from "../../api/dataProvider";
import { useDispatch, useSelector } from "react-redux";
import { setOrder } from "../../redux/slices/order-slice";
import { RootState } from "../../redux/store";
import { useModal } from "@refinedev/antd";
import VoucherModal from "./VoucherModal";

interface DiscountCodeAccordionProps {
  totalMoney: number;
  vouchers: IVoucherResponse[];
  isLoading: boolean;
}

const DiscountCodeAccordion: React.FC<DiscountCodeAccordionProps> = ({
  totalMoney,
  vouchers,
  isLoading,
}) => {
  const { t } = useTranslation();
  const API_URL = useApiUrl();
  const dispatch = useDispatch();
  const { order } = useSelector((state: RootState) => state.order);
  const { open } = useNotification();
  const { getList } = dataProvider(API_URL);
  const [voucherCode, setVoucherCode] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVoucherCode(e.target.value);
  };

  const getTopVoucher = () => {
    const convertedLegitVoucher = vouchers.map((voucher) => {
      const updatedVoucher = { ...voucher };
      if (voucher.type === "PERCENTAGE") {
        updatedVoucher.value = (voucher.value * totalMoney) / 100;
      }
      return updatedVoucher;
    });

    convertedLegitVoucher.sort((a, b) => b.value - a.value);

    return convertedLegitVoucher.length > 0
      ? convertedLegitVoucher[0].code
      : "";
  };

  const applyVoucher = async (event: React.FormEvent) => {
    try {
      event.preventDefault();

      const { data } = await getList<IVoucherResponse>({
        resource: "vouchers",
        filters: [
          {
            field: "code",
            operator: "eq",
            value: voucherCode,
          },
        ],
      });

      const voucher = data[0] ?? ({} as IVoucherResponse);

      if (voucher) {
        dispatch(
          setOrder({
            ...order,
            voucher: voucher,
          })
        );
        open?.({
          type: "success",
          message: "Áp dụng voucher thành công",
          description: "Thành công",
        });
      } else {
        open?.({
          type: "error",
          message: "Voucher không hợp lệ",
          description: "Thất bại",
        });
      }
    } catch (error) {
      open?.({
        type: "error",
        message: "Đã xảy ra lỗi",
        description: "Vui lòng thử lại sau",
      });
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
        isLoading={isLoading}
      />
    </Fragment>
  );
};

export default DiscountCodeAccordion;

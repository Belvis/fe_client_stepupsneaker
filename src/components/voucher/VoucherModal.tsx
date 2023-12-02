import React, { ReactNode, useState } from "react";
import { Modal, List as AntdList } from "antd";
import { IVoucherResponse } from "../../interfaces";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import dayjs from "dayjs";
import { CurrencyFormatter } from "../../helpers/currency";

interface VoucherModalProps {
  vouchers: IVoucherResponse[];
  isLoading: boolean;
  restModalProps: {
    open?: boolean | undefined;
    confirmLoading?: boolean | undefined;
    title?: ReactNode;
    closable?: boolean | undefined;
  };
}

const VoucherModal: React.FC<VoucherModalProps> = ({
  vouchers,
  isLoading,
  restModalProps,
}) => {
  const currency = useSelector((state: RootState) => state.currency);
  const [copied, setCopied] = useState(false);

  function renderItem(item: IVoucherResponse) {
    const { id, code, value, constraint, image, endDate, quantity, type } =
      item;

    const constraintPrice = (
      <CurrencyFormatter value={constraint} currency={currency} />
    );
    const cashPrice =
      type === "CASH" ? (
        <CurrencyFormatter value={value} currency={currency} />
      ) : (
        0
      );

    const handleCopyCode = () => {
      if (code) {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    };

    return (
      <AntdList.Item actions={[]}>
        <AntdList.Item.Meta title={""} description={""} />
        <div className="coupon-container">
          <div className="coupon-card">
            <img src={image} className="logo" />
            {type === "PERCENTAGE" ? (
              <h3>
                Giảm giá {value}% cho đơn hàng trên {constraintPrice}
                <br />
                Nhân ngày t1 vô địch
              </h3>
            ) : (
              <h3>
                Giảm giá {cashPrice} cho đơn hàng trên {constraintPrice}
                <br />
                Nhân ngày t1 vô địch
              </h3>
            )}
            <div className="coupon-row">
              <span id="cpnCode">{code}</span>
              <span id="cpnBtn" onClick={handleCopyCode}>
                {copied ? "COPIED" : "COPY CODE"}
              </span>
            </div>
            <p>Có hạn tới: {dayjs(new Date(endDate)).format("lll")}</p>
            <div className="circle1"></div>
            <div className="circle2"></div>
          </div>
        </div>
      </AntdList.Item>
    );
  }
  return (
    <Modal
      title="Danh sách phiếu giảm giá còn hoạt động"
      {...restModalProps}
      open={restModalProps.open}
      width="700px"
      centered
      footer={<></>}
    >
      <AntdList
        bordered
        itemLayout="horizontal"
        dataSource={vouchers}
        renderItem={renderItem}
        loading={isLoading}
      />
    </Modal>
  );
};

export default VoucherModal;

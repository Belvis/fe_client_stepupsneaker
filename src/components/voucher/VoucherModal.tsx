import { List as AntdList, Modal, ModalProps } from "antd";
import { t } from "i18next";
import React from "react";
import { useSelector } from "react-redux";
import { IOrderResponse, IVoucherList } from "../../interfaces";
import { RootState } from "../../redux/store";
import Voucher from "./Voucher";

interface VoucherModalProps {
  restModalProps: ModalProps;
  close: () => void;
  vouchers: IVoucherList[];
  type?: "apply" | "copy";
  setViewOrder?: React.Dispatch<React.SetStateAction<IOrderResponse>>;
}

const VoucherModal: React.FC<VoucherModalProps> = ({
  restModalProps,
  vouchers,
  type,
  setViewOrder,
  close,
}) => {
  const currency = useSelector((state: RootState) => state.currency);

  function renderItem(item: IVoucherList) {
    return (
      <AntdList.Item actions={[]}>
        <AntdList.Item.Meta title={""} description={""} />
        <Voucher
          item={item.voucher}
          currency={currency}
          type={type}
          setViewOrder={setViewOrder}
          close={close}
        />
      </AntdList.Item>
    );
  }
  return (
    <Modal
      title={t("cart.voucher.modal.title")}
      {...restModalProps}
      open={restModalProps.open}
      width="700px"
      centered
      footer={<></>}
    >
      <AntdList
        itemLayout="horizontal"
        dataSource={vouchers}
        renderItem={renderItem}
      />
    </Modal>
  );
};

export default VoucherModal;

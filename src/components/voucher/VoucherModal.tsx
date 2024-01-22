import React, { ReactNode, useState } from "react";
import { Modal, List as AntdList } from "antd";
import {
  IOrderResponse,
  IVoucherList,
  IVoucherResponse,
} from "../../interfaces";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import dayjs from "dayjs";
import { CurrencyFormatter } from "../../helpers/currency";
import { HttpError, useList } from "@refinedev/core";
import Voucher from "./Voucher";

interface VoucherModalProps {
  restModalProps: {
    open?: boolean | undefined;
    confirmLoading?: boolean | undefined;
    title?: ReactNode;
    closable?: boolean | undefined;
  };
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
      title="Danh sách phiếu giảm giá còn hoạt động"
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

import { useTranslate } from "@refinedev/core";
import { List as AntdList } from "antd";
import { Accordion } from "react-bootstrap";
import { ICustomerResponse, IVoucherList } from "../../interfaces";
import { CurrencyState } from "../../redux/slices/currency-slice";
import Voucher from "../voucher/Voucher";

type AccountVoucherProps = {
  currency: CurrencyState;
  data: ICustomerResponse | undefined;
};

const AccountVoucher: React.FC<AccountVoucherProps> = ({ currency, data }) => {
  const t = useTranslate();

  function renderItem(item: IVoucherList) {
    return (
      <AntdList.Item key={item.id}>
        <Voucher
          item={item.voucher}
          currency={currency}
          type="copy"
          close={() => {}}
        />
      </AntdList.Item>
    );
  }
  return (
    <Accordion.Item eventKey="3" className="single-my-account mb-20">
      <Accordion.Header className="panel-heading">
        <span>4 .</span> {t("my_account.voucher.title")}
      </Accordion.Header>
      <Accordion.Body>
        <div className="myaccount-info-wrapper">
          <div className="account-info-wrapper">
            <h5>{t("my_account.voucher.labels.list")}</h5>
          </div>
          <AntdList
            itemLayout="horizontal"
            dataSource={data?.customerVoucherList || []}
            renderItem={renderItem}
          />
        </div>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default AccountVoucher;

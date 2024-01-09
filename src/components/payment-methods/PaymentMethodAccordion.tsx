import { Radio, RadioChangeEvent } from "antd";
import { Accordion } from "react-bootstrap";
import { useTranslation } from "react-i18next";

type PaymentMethodAccordionProps = {
  selectedPaymentMethod: "Cash" | "Card";
  handlePaymentMethodChange: (e: RadioChangeEvent) => void;
};
const PaymentMethodAccordion: React.FC<PaymentMethodAccordionProps> = ({
  selectedPaymentMethod,
  handlePaymentMethodChange,
}) => {
  const { t } = useTranslation();

  return (
    <div>
      <h3>{t("checkout.payment_methods.title")}</h3>
      <div className="payment-methods-wrapper">
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0" className="single-my-account mb-20">
            <Accordion.Header className="panel-heading">
              <span>{t("checkout.payment_methods.options.cod.title")}</span>
              <img
                src="/images/payment-methods/Icon-GHN.png"
                alt="Mo ta anh"
                style={{
                  height: "30px",
                }}
              />
            </Accordion.Header>
            <Accordion.Body>
              <Radio
                name="paymentMethod"
                value="Cash"
                checked={selectedPaymentMethod === "Cash"}
                onChange={handlePaymentMethodChange}
              >
                {t("checkout.payment_methods.options.cod.description")}
              </Radio>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1" className="single-my-account mb-20">
            <Accordion.Header className="panel-heading">
              <span>
                {t("checkout.payment_methods.options.bank_transfer.title")}
              </span>
              <img
                src="/images/payment-methods/Icon-VNPAY.png"
                alt="Mo ta anh"
                style={{
                  height: "30px",
                }}
              />
            </Accordion.Header>
            <Accordion.Body>
              <Radio
                name="paymentMethod"
                value="Card"
                checked={selectedPaymentMethod === "Card"}
                onChange={handlePaymentMethodChange}
              >
                {t(
                  "checkout.payment_methods.options.bank_transfer.description"
                )}
              </Radio>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  );
};

export default PaymentMethodAccordion;

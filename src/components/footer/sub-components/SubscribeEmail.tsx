import { useRef } from "react";
import { useTranslation } from "react-i18next";
import MailchimpSubscribe from "react-mailchimp-subscribe";

type SubscribeEmailProps = {
  mailchimpUrl: string;
};

type CustomFormProps = {
  subscribe?: (formData: any) => void;
  status: string | null;
  message: string | TrustedHTML | null;
  onValidated: (formData: { EMAIL: string }) => any;
};

const CustomForm: React.FC<CustomFormProps> = ({
  status,
  message,
  onValidated,
}) => {
  const { t } = useTranslation();
  const email = useRef<HTMLInputElement | null>(null);

  const submit = () => {
    if (email.current && email.current.value.indexOf("@") > -1) {
      onValidated({
        EMAIL: email.current.value,
      });
    }

    let emailInput = document.getElementById(
      "mc-form-email"
    ) as HTMLInputElement;
    if (emailInput) {
      emailInput.value = "";
    }
  };

  return (
    <div className="subscribe-form">
      <div className="mc-form">
        <div>
          <input
            id="mc-form-email"
            className="email"
            ref={email}
            type="email"
            placeholder={t("footer.newsletter.buttons.subscribe.place_holder")}
          />
        </div>
        <div className="clear">
          <button className="button" onClick={submit}>
            {t("footer.newsletter.buttons.subscribe.title")}
          </button>
        </div>
      </div>

      {status === "sending" && (
        <div style={{ color: "#3498db", fontSize: "12px" }}>sending...</div>
      )}
      {status === "error" && (
        <div
          style={{ color: "#e74c3c", fontSize: "12px" }}
          dangerouslySetInnerHTML={{ __html: message || "" }}
        />
      )}
      {status === "success" && (
        <div
          style={{ color: "#2ecc71", fontSize: "12px" }}
          dangerouslySetInnerHTML={{ __html: message || "" }}
        />
      )}
    </div>
  );
};

const SubscribeEmail: React.FC<SubscribeEmailProps> = ({ mailchimpUrl }) => {
  return (
    <div>
      <MailchimpSubscribe
        url={mailchimpUrl}
        render={({ subscribe, status, message }) => (
          <CustomForm
            status={status}
            message={message}
            onValidated={(formData) => subscribe(formData)}
          />
        )}
      />
    </div>
  );
};

export default SubscribeEmail;

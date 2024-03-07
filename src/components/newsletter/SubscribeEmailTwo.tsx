import clsx from "clsx";
import { useTranslation } from "react-i18next";
import MailchimpSubscribe from "react-mailchimp-subscribe";

type CustomFormProps = {
  status: string | null;
  message: string | TrustedHTML | null;
  onValidated: (formData: { EMAIL: string }) => void;
  spaceTopClass?: string;
  subscribeBtnClass?: string;
};

const CustomForm: React.FC<CustomFormProps> = ({
  status,
  message,
  onValidated,
  spaceTopClass,
  subscribeBtnClass,
}) => {
  const { t } = useTranslation();

  let email: HTMLInputElement | null;

  const submit = () => {
    email &&
      email.value.indexOf("@") > -1 &&
      onValidated({
        EMAIL: email.value,
      });

    if (email) {
      email.value = "";
    }
  };

  return (
    <div className={clsx("subscribe-form-3", spaceTopClass)}>
      <div className="mc-form">
        <div>
          <input
            className="email"
            ref={(node) => (email = node)}
            type="email"
            placeholder={
              t(`newsletter.buttons.subscribe.place_holder`) || undefined
            }
            required
          />
        </div>
        {status === "sending" && (
          <div style={{ color: "#3498db", fontSize: "12px" }}>đang gửi...</div>
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
        <div
          className={`clear-3 ${subscribeBtnClass ? subscribeBtnClass : ""}`}
        >
          <button className="button" onClick={submit}>
            {t(`newsletter.buttons.subscribe.title`)}
          </button>
        </div>
      </div>
    </div>
  );
};

type SubscribeEmailTwoProps = {
  mailchimpUrl: string;
  spaceTopClass?: string;
  subscribeBtnClass?: string;
};

const SubscribeEmailTwo: React.FC<SubscribeEmailTwoProps> = ({
  mailchimpUrl,
  spaceTopClass,
  subscribeBtnClass,
}) => {
  return (
    <div>
      <MailchimpSubscribe
        url={mailchimpUrl}
        render={({ subscribe, status, message }) => (
          <CustomForm
            status={status}
            message={message}
            onValidated={(formData) => subscribe(formData)}
            spaceTopClass={spaceTopClass}
            subscribeBtnClass={subscribeBtnClass}
          />
        )}
      />
    </div>
  );
};

export default SubscribeEmailTwo;

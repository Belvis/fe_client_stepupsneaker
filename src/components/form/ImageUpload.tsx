import { InboxOutlined } from "@ant-design/icons";
import { getValueFromEvent } from "@refinedev/antd";
import { useTranslate } from "@refinedev/core";
import {
  Avatar,
  Form,
  FormInstance,
  FormProps,
  Image,
  Input,
  Space,
  Spin,
  Typography,
  Upload,
} from "antd";
import { LabelTooltipType } from "antd/es/form/FormItemLabel";
import {
  RcFile,
  UploadChangeParam,
  UploadFile,
  UploadProps,
} from "antd/es/upload/interface";
import React, { ReactNode, useState } from "react";
import { getBase64Image } from "../../helpers/image";
import { showErrorToast } from "../../helpers/toast";
import { styles } from "./style";

const { Text } = Typography;

interface IImageUploadProps {
  form: FormInstance;
  label?: ReactNode;
  tooltip?: LabelTooltipType;
  required?: boolean;
  hidden?: boolean;
  raw?: boolean;
  name?: string;
}

const ImageUpload: React.FC<IImageUploadProps> = ({
  form,
  label,
  tooltip,
  required = false,
  hidden = false,
  raw = false,
  name = "urlImage",
}) => {
  const t = useTranslate();
  const [loadingImage, setLoadingImage] = useState(false);
  const imageUrl = Form.useWatch(name, form);

  const handleChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === "uploading") {
      setLoadingImage(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64Image(info.file.originFileObj as RcFile, (url) => {
        setLoadingImage(false);
        form.setFieldValue(name, url);
      });
    }
  };

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      showErrorToast(t("image.error.invalid"));
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      showErrorToast(t("image.error.exceed"));
    }
    return isJpgOrPng && isLt2M;
  };

  return (
    <Spin spinning={loadingImage}>
      <Form.Item
        name={name}
        valuePropName="file"
        getValueFromEvent={getValueFromEvent}
        label={label}
        tooltip={tooltip}
        noStyle={!label}
        required={required}
        hidden={hidden}
        rules={[
          {
            required: required,
          },
        ]}
      >
        <Upload.Dragger
          name="file"
          beforeUpload={beforeUpload}
          onChange={handleChange}
          showUploadList={false}
          customRequest={({ onSuccess, onError, file }) => {
            if (onSuccess) {
              try {
                onSuccess("ok");
              } catch (error) {}
            }
          }}
          maxCount={1}
          style={!raw ? styles.imageUpload : undefined}
        >
          {raw ? (
            <div>
              {imageUrl ? (
                <Image width={200} src={imageUrl} preview={false} />
              ) : (
                <>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">{t("image.dragger.text")}</p>
                </>
              )}
            </div>
          ) : (
            <Space direction="vertical" size={2}>
              {imageUrl ? (
                <Avatar
                  style={styles.avatar}
                  src={imageUrl}
                  alt="User avatar"
                />
              ) : (
                <Avatar
                  style={styles.avatar}
                  src="/images/user-default-img.png"
                  alt="Default avatar"
                />
              )}
              <Text style={styles.imageDescription}>
                {t(`image.description.${imageUrl ? "edit" : "add"}`)}
              </Text>
              <Text style={styles.imageValidation}>
                {t("image.validation", { size: 1080 })}
              </Text>
            </Space>
          )}
        </Upload.Dragger>
      </Form.Item>
    </Spin>
  );
};

export default ImageUpload;

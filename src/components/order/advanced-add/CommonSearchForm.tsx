import { SearchOutlined, UndoOutlined } from "@ant-design/icons";
import { useTranslate } from "@refinedev/core";
import {
  Button,
  Col,
  Form,
  FormProps,
  Grid,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import { DefaultOptionType, SelectProps } from "antd/es/select";
import { debounce } from "lodash";
import React, { useCallback } from "react";

const { Text } = Typography;

interface CommonSearchFormProps {
  hideTitle?: boolean;
  hideRefresh?: boolean;
  formProps: FormProps;
  title?: string;
  fields: {
    label: string;
    name: string;
    mode?: "multiple" | "tags";
    type: "input" | "select" | "input-number";
    props?: SelectProps;
    showLabel?: boolean;
    placeholder?: string;
    hidden?: boolean;
    width?: string;
    options?: DefaultOptionType[] | undefined;
  }[];
  columnRatio?: [number, number, number];
}

const CommonSearchForm: React.FC<CommonSearchFormProps> = ({
  hideTitle = false,
  hideRefresh = false,
  formProps,
  title,
  fields,
  columnRatio = [3, 18, 3],
}) => {
  const t = useTranslate();
  const breakpoint = Grid.useBreakpoint();

  const handleClearFilters = () => {
    formProps.form?.resetFields();
    formProps.form?.submit();
  };

  const debouncedSubmit = useCallback(
    debounce(() => {
      formProps.form?.submit();
    }, 500),
    []
  );

  const renderInput = (field: {
    label: string;
    name: string;
    type: "input" | "select" | "input-number";
    mode?: "multiple" | "tags";
    props?: SelectProps;
    placeholder?: string;
    hidden?: boolean;
    width?: string;
    options?: DefaultOptionType[] | undefined;
  }) => {
    if (field.type === "input") {
      return (
        <Input
          style={{
            width: field.width ?? "100%",
          }}
          placeholder={field.placeholder}
          suffix={<SearchOutlined />}
        />
      );
    } else if (field.type === "input-number") {
      return (
        <InputNumber
          min={1}
          formatter={(value) =>
            `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value: string | undefined) => {
            const parsedValue = parseInt(value!.replace(/₫\s?|(,*)/g, ""), 10);
            const newValue = isNaN(parsedValue) ? 0 : parsedValue;
            return newValue;
          }}
          style={{
            width: field.width ?? "100%",
          }}
        />
      );
    } else {
      return null;
    }
  };

  return (
    <Form
      {...formProps}
      onValuesChange={debouncedSubmit}
      initialValues={Object.fromEntries(
        fields.map((field) => [field.name, undefined])
      )}
    >
      <Row gutter={[16, 24]} align="middle" justify="center">
        <Col span={columnRatio[0]}>
          {!hideTitle && (
            <Text style={{ fontSize: "18px" }} strong>
              {title || "Bộ lọc"}
            </Text>
          )}
        </Col>
        <Col md={columnRatio[1]}>
          <Space
            className={`w-100 ${breakpoint.md ? "" : "justify-content-center"}`}
            wrap
            align="center"
          >
            {fields.map((field) => (
              <div className="d-flex align-items-center" key={field.name}>
                {field.showLabel !== undefined && field.showLabel === true && (
                  <Text className="flex-shrink-0 me-2">{field.label}</Text>
                )}
                <Form.Item
                  key={field.name}
                  name={field.name}
                  label={field.label}
                  hidden={field.hidden !== undefined ? field.hidden : false}
                  noStyle
                >
                  {field.type === "select" ? (
                    <Select
                      {...(field.props && { ...field.props })}
                      placeholder={field.placeholder}
                      style={{
                        width: field.width ?? "100%",
                      }}
                      {...(field.options && { options: field.options })}
                    />
                  ) : (
                    renderInput(field)
                  )}
                </Form.Item>
              </div>
            ))}
          </Space>
        </Col>
        <Col md={columnRatio[2]}>
          {!hideRefresh && (
            <Button icon={<UndoOutlined />} onClick={handleClearFilters}>
              {t("actions.clear")}
            </Button>
          )}
        </Col>
      </Row>
    </Form>
  );
};

export default CommonSearchForm;

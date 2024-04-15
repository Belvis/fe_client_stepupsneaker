import { useTranslate } from "@refinedev/core";
import { FormProps, Tag } from "antd";
import { useSelect } from "@refinedev/antd";
import CommonSearchForm from "./CommonSearchForm";
import { getProductStatusOptions } from "../../../constants/status";
import { isLightColor } from "../../../helpers/color";
import { IColorResponse, IProdAttributeResponse } from "../../../interfaces";

type ProductSearchFormProps = {
  formProps: FormProps;
};

export const renderColor = (value: string, label: string) => {
  const textColor = isLightColor(label) ? "#000000" : "#ffffff";
  const tagStyle = {
    color: textColor,
    border: isLightColor(label) ? "1px solid #000000" : "none",
  };

  return {
    value: value,
    label: (
      <Tag
        className="w-100"
        color={`#${label}`}
        style={tagStyle}
      >{`#${label}`}</Tag>
    ),
  };
};

export const ProductSearchForm: React.FC<ProductSearchFormProps> = ({
  formProps,
}) => {
  const t = useTranslate();

  const { selectProps: brandSelectProps } = useSelect<IProdAttributeResponse>({
    resource: "products/brands?pageSize=10&",
    optionLabel: "name",
    optionValue: "id",
    debounce: 500,
    onSearch: (value) => [
      {
        field: "q",
        operator: "eq",
        value,
      },
    ],
  });

  const { selectProps: styleSelectProps } = useSelect<IProdAttributeResponse>({
    resource: "products/styles?pageSize=10&",
    optionLabel: "name",
    optionValue: "id",
    debounce: 500,
    onSearch: (value) => [
      {
        field: "q",
        operator: "eq",
        value,
      },
    ],
  });

  const { selectProps: materialSelectProps } =
    useSelect<IProdAttributeResponse>({
      resource: "products/materials?pageSize=10&",
      optionLabel: "name",
      optionValue: "id",
      debounce: 500,
      onSearch: (value) => [
        {
          field: "q",
          operator: "eq",
          value,
        },
      ],
    });

  const { selectProps: tradeMarkSelectProps } =
    useSelect<IProdAttributeResponse>({
      resource: "products/trade-marks?pageSize=10&",
      optionLabel: "name",
      optionValue: "id",
      debounce: 500,
      onSearch: (value) => [
        {
          field: "q",
          operator: "eq",
          value,
        },
      ],
    });

  const { selectProps: soleSelectProps } = useSelect<IProdAttributeResponse>({
    resource: "products/soles?pageSize=10&",
    optionLabel: "name",
    optionValue: "id",
    debounce: 500,
    pagination: {
      pageSize: 10,
    },
    onSearch: (value) => [
      {
        field: "q",
        operator: "eq",
        value,
      },
    ],
  });

  const { selectProps: colorSelectProps } = useSelect<IColorResponse>({
    resource: "products/colors?pageSize=10&",
    optionLabel: "code",
    optionValue: "id",
    onSearch: (value) => [
      {
        field: "q",
        operator: "eq",
        value,
      },
    ],
  });

  const { selectProps: sizeSelectProps } = useSelect<IProdAttributeResponse>({
    resource: "products/sizes?pageSize=10&",
    optionLabel: "name",
    optionValue: "id",
    onSearch: (value) => [
      {
        field: "q",
        operator: "eq",
        value,
      },
    ],
  });

  return (
    <CommonSearchForm
      title={t("productDetails.filters.title")}
      formProps={formProps}
      fields={[
        {
          label: t("productDetails.fields.color"),
          placeholder: t(`productDetails.filters.color.placeholder`),
          name: "color",
          type: "select",
          mode: "multiple",
          width: "200px",
          props: colorSelectProps,
          options: colorSelectProps.options?.map((item) =>
            renderColor(item.value as string, item.label as string)
          ),
        },
        {
          label: t(`productDetails.fields.size`),
          placeholder: t(`productDetails.filters.size.placeholder`),
          name: "size",
          type: "select",
          mode: "multiple",
          props: sizeSelectProps,
          width: "200px",
        },
        {
          label: t(`productDetails.fields.status`),
          name: "status",
          placeholder: t(`productDetails.filters.status.placeholder`),
          type: "select",
          options: getProductStatusOptions(t),
          width: "200px",
        },
        {
          label: t(`productDetails.fields.brand`),
          placeholder: t(`productDetails.filters.brand.placeholder`),
          name: "brand",
          type: "select",
          mode: "multiple",
          props: brandSelectProps,
          width: "200px",
        },
        {
          label: t(`productDetails.fields.material`),
          placeholder: t(`productDetails.filters.material.placeholder`),
          name: "material",
          type: "select",
          mode: "multiple",
          props: materialSelectProps,
          width: "200px",
        },
        {
          label: t(`productDetails.fields.sole`),
          placeholder: t(`productDetails.filters.sole.placeholder`),
          name: "sole",
          type: "select",
          mode: "multiple",
          props: soleSelectProps,
          width: "200px",
        },
        {
          label: t(`productDetails.fields.style`),
          placeholder: t(`productDetails.filters.style.placeholder`),
          name: "style",
          type: "select",
          mode: "multiple",
          props: styleSelectProps,
          width: "200px",
        },
        {
          label: t(`productDetails.fields.tradeMark`),
          placeholder: t(`productDetails.filters.tradeMark.placeholder`),
          name: "tradeMark",
          type: "select",
          mode: "multiple",
          props: tradeMarkSelectProps,
          width: "200px",
        },
        {
          label: "",
          name: "q",
          type: "input",
          placeholder: t(`productDetails.filters.search.placeholder`),
        },
        {
          label: t(`productDetails.filters.priceMin.label`),
          name: "priceMin",
          type: "input-number",
          showLabel: true,
        },
        {
          label: t(`productDetails.filters.priceMax.label`),
          name: "priceMax",
          type: "input-number",
          showLabel: true,
        },
      ]}
    />
  );
};

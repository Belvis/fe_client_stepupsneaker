import { useCreateMany, useTranslate } from "@refinedev/core";
import {
  List as AntdList,
  Form,
  FormInstance,
  Grid,
  Image,
  Input,
  Modal,
  ModalProps,
  Rate,
  Space,
  Typography,
} from "antd";

import React from "react";
import { useSelector } from "react-redux";
import { CurrencyFormatter } from "../../helpers/currency";
import { validateCommon } from "../../helpers/validate";
import { IOrderDetailResponse } from "../../interfaces";
import { CurrencyState } from "../../redux/slices/currency-slice";
import { RootState } from "../../redux/store";
import ImageUpload from "../form/ImageUpload";

const { Text } = Typography;

type BatchReviewProps = {
  modalProps: ModalProps;
  close: () => void;
  callBack: any;
  orderDetailToReview: IOrderDetailResponse[];
};

export const BatchReview: React.FC<BatchReviewProps> = ({
  modalProps,
  close,
  orderDetailToReview,
  callBack,
}) => {
  const t = useTranslate();
  const breakpoint = Grid.useBreakpoint();
  const currency = useSelector((state: RootState) => state.currency);
  const { mutate } = useCreateMany();

  const [form] = Form.useForm();

  const onFinishHandler = () => {
    const payLoad = orderDetailToReview.map((o, index) => {
      return {
        productDetail: o.productDetail.id,
        order: o.order.id,
        comment: form.getFieldValue(`comment${index}`),
        rating: form.getFieldValue(`rating${index}`),
        urlImage: form.getFieldValue(`urlImage${index}`),
      };
    });

    try {
      mutate(
        {
          resource: "product/reviews",
          values: payLoad,
          successNotification: () => ({
            message: "Cảm ơn bạn đã chia sẻ trải nghiệm mua sắm với chúng tôi!",
            description: "Đánh giá thành công",
            type: "success",
          }),
          errorNotification: (error) => ({
            message: t("common.error") + error?.message,
            description: "Oops...",
            type: "error",
          }),
        },
        {
          onError: (error, variables, context) => {},
          onSuccess: () => {
            close();
            callBack();
          },
        }
      );
    } catch (error) {
      console.error("Creation failed", error);
    }
  };

  return (
    <Modal
      {...modalProps}
      title="Viết đánh giá"
      zIndex={1001}
      width={breakpoint.sm ? "700px" : "100%"}
      onOk={() => form.submit()}
    >
      <Form form={form} onFinish={onFinishHandler} layout="horizontal">
        <AntdList
          size="large"
          bordered
          className="p-3"
          pagination={false}
          dataSource={orderDetailToReview}
          renderItem={(item, index) => (
            <AntdList.Item>
              <MenuItem
                item={item}
                index={index}
                form={form}
                currency={currency}
              />
            </AntdList.Item>
          )}
        ></AntdList>
      </Form>
    </Modal>
  );
};

const MenuItem: React.FC<{
  item: IOrderDetailResponse;
  index: number;
  form: FormInstance;
  currency: CurrencyState;
}> = ({ item, index, form, currency }) => {
  const t = useTranslate();

  return (
    <Space direction="vertical" className="w-100" key={item.id}>
      <div className="row">
        <div className="col-4">
          <Image src={item.productDetail.image} preview={true} />
        </div>
        <div className="col-8 d-flex flex-column">
          <Text className="h3">{item.productDetail.product.name}</Text>
          <br />
          <Text className="h5">
            {t(`cart.table.head.size`)}: {item.productDetail.size.name}
          </Text>
          <br />
          <Text className="h5">
            {t(`cart.table.head.color`)}: {item.productDetail.color.name}
          </Text>
          <br />
          <Text className="h5">
            {t(`cart.table.head.unit_price`)}:{" "}
            <CurrencyFormatter
              className="amount"
              value={item.price}
              currency={currency}
            />
          </Text>
        </div>
      </div>
      <Form.Item
        label={t(`products.desc_tab.fields.your_rating`)}
        required
        name={`rating${index}`}
        rules={[
          {
            validator: (_, value) => validateCommon(_, value, t, "rating"),
          },
        ]}
      >
        <Rate allowHalf />
      </Form.Item>
      <Form.Item
        name={`comment${index}`}
        required
        rules={[
          {
            validator: (_, value) => validateCommon(_, value, t, "comment"),
          },
        ]}
      >
        <Input.TextArea
          className="m-0"
          placeholder={t(`products.desc_tab.fields.message`) || ""}
        />
      </Form.Item>
      <ImageUpload name={`urlImage${index}`} form={form} raw />
    </Space>
  );
};

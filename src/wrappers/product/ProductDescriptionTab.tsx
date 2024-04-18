import { useForm } from "@refinedev/antd";
import { HttpError, useList, useTranslate } from "@refinedev/core";
import { Form, Input, Rate, Spin } from "antd";
import clsx from "clsx";
import { useState } from "react";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import { useParams } from "react-router-dom";
import ImageUpload from "../../components/form/ImageUpload";
import Reviews from "../../components/review/Reviews";
import { validateCommon } from "../../helpers/validate";
import {
  IProductResponse,
  IReviewRequest,
  IReviewResponse,
} from "../../interfaces";

interface ProductDescriptionTabProps {
  spaceBottomClass: string;
  productFullDesc: string;
  product: IProductResponse;
}

const ProductDescriptionTab: React.FC<ProductDescriptionTabProps> = ({
  spaceBottomClass,
  productFullDesc,
  product,
}) => {
  const t = useTranslate();
  let { id } = useParams();

  const [previewOpen, setPreviewOpen] = useState(false);

  const { onFinish, formProps, saveButtonProps, formLoading } =
    useForm<IReviewRequest>({
      resource: "product/reviews",
      action: "create",
      onMutationSuccess(data, variables, context, isAutoSave) {
        formProps.form?.resetFields();
        refetch();
      },
      successNotification: (data, values, resource) => {
        return {
          message: t("products.desc_tab.messages.success"),
          description: t("common.success"),
          type: "success",
        };
      },
      errorNotification: (error, values, resource) => {
        return {
          message: t("common.error") + error?.message,
          description: "Oops...",
          type: "error",
        };
      },
    });

  const { data, isLoading, isError, refetch } = useList<
    IReviewResponse,
    HttpError
  >({
    resource: "product/reviews",
    filters: [
      {
        field: "product",
        operator: "eq",
        value: id,
      },
    ],
  });

  const reviews = data?.data ? data?.data : [];

  const onFinishHandler = (values: any) => {
    const updatedValues = [
      {
        ...values,
      },
    ];

    onFinish(updatedValues);
  };

  const handleCancel = () => setPreviewOpen(false);

  return (
    <div
      className={clsx("description-review-area", spaceBottomClass, "bg-white")}
    >
      <div className="container">
        <div className="description-review-wrapper">
          <Tab.Container defaultActiveKey="productDescription">
            <Nav variant="pills" className="description-review-topbar">
              <Nav.Item>
                <Nav.Link eventKey="additionalInfo">
                  {t(`products.desc_tab.additional_information`)}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="productDescription">
                  {t(`products.desc_tab.description`)}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="productReviews">
                  {t(`products.desc_tab.reviews`)} ({reviews.length})
                </Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content className="description-review-bottom">
              <Tab.Pane eventKey="additionalInfo">
                <div className="product-anotherinfo-wrapper">
                  <ul>
                    <li>
                      <span>{t("products.anotherinfo.weight")}</span> 400 g
                    </li>
                    <li>
                      <span>{t("products.anotherinfo.dimension")}</span>10 x 10
                      x 15 cm{" "}
                    </li>
                    <li>
                      <span>{t("products.anotherinfo.material")}</span> 60%
                      cotton, 40% polyester
                    </li>
                    <li>
                      <span>{t("products.anotherinfo.otherInfo.title")}</span>{" "}
                      {t("products.anotherinfo.otherInfo.content")}
                    </li>
                  </ul>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="productDescription">
                {productFullDesc}
              </Tab.Pane>
              <Tab.Pane eventKey="productReviews">
                <div className="row">
                  <div className="col-lg-7">
                    <div className="review-wrapper">
                      <Spin spinning={isLoading}>
                        <Reviews reviews={reviews} calback={refetch} />
                      </Spin>
                    </div>
                  </div>
                  <div className="col-lg-5">
                    <div className="ratting-form-wrapper pl-50">
                      <h3>{t(`products.desc_tab.buttons.add_review`)}</h3>
                      <div className="ratting-form">
                        <Spin spinning={formLoading}>
                          <Form
                            {...formProps}
                            onFinish={onFinishHandler}
                            layout="horizontal"
                          >
                            <div className="mt-3">
                              <Form.Item
                                label={t(
                                  `products.desc_tab.fields.your_rating`
                                )}
                                required
                                name="rating"
                                rules={[
                                  {
                                    validator: (_, value) =>
                                      validateCommon(_, value, t, "rating"),
                                  },
                                ]}
                              >
                                <Rate allowHalf />
                              </Form.Item>
                            </div>
                            <div className="row">
                              <div className="col-md-12 rating-select">
                                <Form.Item
                                  name="productDetail"
                                  required
                                  rules={[
                                    {
                                      validator: (_, value) =>
                                        validateCommon(
                                          _,
                                          value,
                                          t,
                                          "productDetails"
                                        ),
                                    },
                                  ]}
                                >
                                  {product.productDetails.length > 0 ? (
                                    <select>
                                      <option value="">
                                        --
                                        {t(
                                          `products.desc_tab.fields.productDetails.placeholder`
                                        )}
                                        --
                                      </option>
                                      {product.productDetails
                                        .sort((a, b) => {
                                          if (a.color.name < b.color.name)
                                            return -1;
                                          if (a.color.name > b.color.name)
                                            return 1;

                                          if (a.size.name < b.size.name)
                                            return -1;
                                          if (a.size.name > b.size.name)
                                            return 1;

                                          return 0;
                                        })
                                        .map((productDetail, index) => (
                                          <option
                                            key={productDetail.id}
                                            value={productDetail.id}
                                          >
                                            {productDetail.product.name} |{" "}
                                            {productDetail.color.name} -{" "}
                                            {productDetail.size.name}
                                          </option>
                                        ))}
                                    </select>
                                  ) : (
                                    <select>
                                      <option value="">Loading...</option>
                                    </select>
                                  )}
                                </Form.Item>
                              </div>
                              <div className="col-md-12">
                                <div className="rating-form-style form-submit">
                                  <Form.Item
                                    name="comment"
                                    required
                                    rules={[
                                      {
                                        validator: (_, value) =>
                                          validateCommon(
                                            _,
                                            value,
                                            t,
                                            "comment"
                                          ),
                                      },
                                    ]}
                                  >
                                    <textarea
                                      className="m-0"
                                      placeholder={
                                        t(`products.desc_tab.fields.message`) ||
                                        ""
                                      }
                                    />
                                  </Form.Item>
                                  <div
                                    className="col-md-12"
                                    style={{ marginBottom: "24px" }}
                                  >
                                    {formProps.form && (
                                      <ImageUpload form={formProps.form} raw />
                                    )}
                                  </div>
                                  <input
                                    type="submit"
                                    className="w-100"
                                    value={
                                      t(`products.desc_tab.buttons.submit`) ||
                                      ""
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            <Form.Item name="order" initialValue={null} hidden>
                              <Input />
                            </Form.Item>
                          </Form>
                        </Spin>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
    </div>
  );
};

export default ProductDescriptionTab;

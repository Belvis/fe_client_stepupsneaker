import { PlusOutlined } from "@ant-design/icons";
import { useForm } from "@refinedev/antd";
import { Form, Modal, Rate, Spin, Upload, UploadFile } from "antd";
import { RcFile, UploadChangeParam, UploadProps } from "antd/es/upload";
import clsx from "clsx";
import { useState } from "react";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import { useTranslation } from "react-i18next";
import { getBase64, getBase64Image } from "../../helpers/image";
import { showErrorToast } from "../../helpers/toast";
import {
  IProductResponse,
  IReviewRequest,
  IReviewResponse,
} from "../../interfaces";
import { HttpError, useList, useTranslate } from "@refinedev/core";
import { useParams } from "react-router-dom";
import Reviews from "../../components/review/Reviews";
import { validateCommon } from "../../helpers/validate";

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
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loadingImage, setLoadingImage] = useState(false);

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
          message: `Gửi đánh giá thành công`,
          description: "Thành công",
          type: "success",
        };
      },
      errorNotification: (error, values, resource) => {
        return {
          message: `${error?.message}`,
          description: "Đã có lỗi xảy ra",
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
    const updatedValues = {
      ...values,
    };

    onFinish(updatedValues);
  };

  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
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

  const handleChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    setFileList(info.fileList);

    if (info.file.status === "uploading") {
      setLoadingImage(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64Image(info.file.originFileObj as RcFile, (url) => {
        setLoadingImage(false);
        formProps.form?.setFieldValue("urlImage", url);
      });
    }
  };

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
                      <span>Cân nặng</span> 400 g
                    </li>
                    <li>
                      <span>Kích thước</span>10 x 10 x 15 cm{" "}
                    </li>
                    <li>
                      <span>Nguyên liệu</span> 60% cotton, 40% polyester
                    </li>
                    <li>
                      <span>Thông tin khác</span> Bạn có thể xem chi tiết từng
                      góc cạnh của sản phẩm bằng cách quét mã QR code đi kèm
                      trên hộp giày.
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
                        <Reviews reviews={reviews} />
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
                                        --Chọn sản phẩm của bạn--
                                      </option>
                                      {product.productDetails.map(
                                        (productDetail, index) => (
                                          <option
                                            key={productDetail.id}
                                            value={productDetail.id}
                                          >
                                            {productDetail.product.name} |{" "}
                                            {productDetail.color.name} -{" "}
                                            {productDetail.size.name}
                                          </option>
                                        )
                                      )}
                                    </select>
                                  ) : (
                                    <select>
                                      <option value="">
                                        Đang tải sản phẩm...
                                      </option>
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
                                      placeholder={
                                        t(`products.desc_tab.fields.message`) ||
                                        ""
                                      }
                                    />
                                  </Form.Item>
                                  <div className="col-md-12">
                                    <Form.Item name="urlImage">
                                      <Upload
                                        listType="picture-card"
                                        onPreview={handlePreview}
                                        fileList={fileList}
                                        beforeUpload={beforeUpload}
                                        maxCount={1}
                                        onChange={handleChange}
                                        customRequest={({
                                          onSuccess,
                                          onError,
                                          file,
                                        }) => {
                                          if (onSuccess) {
                                            try {
                                              onSuccess("ok");
                                            } catch (error) {
                                              console.error(error);
                                            }
                                          }
                                        }}
                                        multiple
                                        style={{
                                          border: "none",
                                          width: "100%",
                                          background: "none",
                                        }}
                                      >
                                        {fileList.length >= 1 ? null : (
                                          <div>
                                            <PlusOutlined />
                                            <div style={{ marginTop: 8 }}>
                                              Tải lên
                                            </div>
                                          </div>
                                        )}
                                      </Upload>
                                    </Form.Item>
                                  </div>
                                  <input
                                    type="submit"
                                    value={
                                      t(`products.desc_tab.buttons.submit`) ||
                                      ""
                                    }
                                  />
                                </div>
                              </div>
                            </div>
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
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img className="w-100" alt="image-preview" src={previewImage} />
      </Modal>
    </div>
  );
};

export default ProductDescriptionTab;

import { DeleteOutlined } from "@ant-design/icons";
import { NumberField } from "@refinedev/antd";
import { useTranslate } from "@refinedev/core";
import {
  Avatar,
  Button,
  Card,
  Col,
  Flex,
  InputNumber,
  Row,
  Typography,
  theme,
} from "antd";
import { isNumber } from "lodash";
import { IProductDetailResponse } from "../../../interfaces";
import { getDiscountPrice } from "../../../helpers/product";
const { useToken } = theme;
const { Text } = Typography;

type ProductDetailItemProps = {
  productDetail: IProductDetailResponse;
  count: number;
  callBack: (productId: string, newQuantity: number) => void;
  onRemove: (productId: string) => void;
};

export const ProductDetailItem: React.FC<ProductDetailItemProps> = ({
  productDetail,
  callBack,
  count,
  onRemove,
}) => {
  const t = useTranslate();
  const { token } = useToken();

  const { quantity, product, price, color, size } = productDetail;

  const promotionProductDetailsActive = (
    productDetail.promotionProductDetails ?? []
  ).filter((productDetail) => productDetail.promotion.status == "ACTIVE");

  const maxPromotionProductDetail = promotionProductDetailsActive.reduce(
    (maxProduct, currentProduct) => {
      return currentProduct.promotion.value > maxProduct.promotion.value
        ? currentProduct
        : maxProduct;
    },
    promotionProductDetailsActive[0]
  );

  const discount =
    promotionProductDetailsActive.length > 0
      ? maxPromotionProductDetail.promotion.value
      : 0;

  const discountedPrice = getDiscountPrice(price, discount);

  const finalProductPrice = +(productDetail.price * 1);
  const finalDiscountedPrice = +((discountedPrice ?? discount) * 1);

  const handleQuantityChange = (value: number | null) => {
    if (value !== null) callBack(productDetail.id, value);
    if (isNumber(value) && value <= 0) onRemove(productDetail.id);
  };

  return (
    <Card
      style={{
        boxShadow: "0 4px 4px rgba(0, 0, 0, 0.1)",
      }}
      className="order-items"
    >
      <Row align="middle" justify="center">
        <Col span={1}>
          <Text>{count + 1}</Text>
        </Col>
        <Col span={9}>
          <Flex gap={15}>
            <Avatar shape="square" size={64} src={productDetail.image} />
            <Flex vertical>
              <Text strong>{product.name}</Text>
              <Text>
                {t("products.fields.size")}: {size.name}
              </Text>
              <Text>
                {t("products.fields.color")}: {color.name}
              </Text>
            </Flex>
          </Flex>
        </Col>
        <Col span={3}>
          <InputNumber
            min={1}
            className="order-tab-quantity text-center"
            variant="borderless"
            style={{
              width: "100%",
              borderBottom: `1px solid ${token.colorPrimary}`,
              borderRadius: 0,
            }}
            value={quantity}
            onChange={handleQuantityChange}
          />
        </Col>
        <Col span={4} style={{ textAlign: "end" }}>
          <Text>
            <NumberField
              options={{
                currency: "VND",
                style: "currency",
              }}
              locale={"vi"}
              value={
                discountedPrice !== null
                  ? finalDiscountedPrice
                  : finalProductPrice
              }
            />
          </Text>
        </Col>
        <Col span={4} className="text-end">
          <Text>
            <NumberField
              options={{
                currency: "VND",
                style: "currency",
              }}
              locale={"vi"}
              value={
                (discountedPrice !== null
                  ? finalDiscountedPrice
                  : finalProductPrice) * quantity
              }
            />
          </Text>
        </Col>
        <Col span={3} className="text-center">
          <Button
            shape="circle"
            type="text"
            onClick={() => onRemove(productDetail.id)}
            icon={<DeleteOutlined />}
          />
        </Col>
      </Row>
    </Card>
  );
};

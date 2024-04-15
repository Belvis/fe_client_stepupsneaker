import { useTranslate } from "@refinedev/core";
import { Card, Col, Row, Typography } from "antd";

const { Text } = Typography;

const ShoppingCartHeader = () => {
  const t = useTranslate();

  return (
    <Card
      size="small"
      styles={{
        body: {
          padding: "12px 24px",
        },
      }}
    >
      <Row align="middle">
        <Col span={2}>
          <Text strong>#</Text>
        </Col>
        <Col span={8}>
          <Text strong>{t("orderDetails.fields.products")}</Text>
        </Col>
        <Col span={3} className="text-center">
          <Text strong>{t("orderDetails.fields.qty")}</Text>
        </Col>
        <Col span={4} className="text-end">
          <Text strong>{t("orderDetails.fields.price")}</Text>
        </Col>
        <Col span={4} className="text-end">
          <Text strong>{t("orderDetails.fields.totalPrice")}</Text>
        </Col>
        <Col span={3} className="text-end"></Col>
      </Row>
    </Card>
  );
};

export default ShoppingCartHeader;

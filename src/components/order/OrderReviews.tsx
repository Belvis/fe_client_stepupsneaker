import { useModal } from "@refinedev/antd";
import { useTranslate } from "@refinedev/core";
import { List as AntdList, Image, Input, Rate, Space, Typography } from "antd";
import { Accordion } from "react-bootstrap";
import { IOrderResponse, IReviewResponse } from "../../interfaces";
import { BatchReview } from "../review/BatchReview";

type OrderReviewsProps = {
  order: IOrderResponse;
  callBack: any;
};

const { Text } = Typography;

const OrderReviews: React.FC<OrderReviewsProps> = ({ order, callBack }) => {
  const t = useTranslate();

  const {
    show,
    modalProps: { visible: vi, ...restProps },
    close,
  } = useModal();

  return (
    <div className="myaccount-wrapper mt-3">
      <Accordion.Item eventKey="1" className="single-my-account mb-20">
        <Accordion.Header className="panel-heading">
          {order.countReview == 0
            ? "Chúng tôi vẫn đang đợi phản hồi của bạn!"
            : "Đánh giá của bạn "}
        </Accordion.Header>
        <Accordion.Body>
          {order.countReview == 0 ? (
            <div className="myaccount-info-wrapper">
              <div className="account-info-wrapper">
                <div className="row align-items-center">
                  <div className="col-8">
                    <h5>
                      Bạn có hài lòng với trải nghiệm mua sắm vừa rồi? Hãy chia
                      sẻ suy nghĩ với chúng tôi!
                    </h5>
                  </div>
                  <div className="col-4">
                    <div className="billing-back-btn m-0">
                      <div className="billing-btn">
                        <button onClick={show}>Viết đánh giá</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="myaccount-info-wrapper">
              <div className="account-info-wrapper">
                <AntdList
                  size="large"
                  className="p-3"
                  pagination={false}
                  dataSource={order.reviews}
                  renderItem={(item, index) => (
                    <AntdList.Item>
                      <MenuItem item={item} index={index} />
                    </AntdList.Item>
                  )}
                />
              </div>
            </div>
          )}
        </Accordion.Body>
      </Accordion.Item>
      <BatchReview
        modalProps={restProps}
        close={close}
        orderDetailToReview={order.orderDetailToReview}
        callBack={callBack}
      />
    </div>
  );
};

export default OrderReviews;

const MenuItem: React.FC<{
  item: IReviewResponse;
  index: number;
}> = ({ item, index }) => {
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
        </div>
      </div>
      <Rate allowHalf value={item.rating} />
      <Input.TextArea
        className="m-0"
        placeholder={t(`products.desc_tab.fields.message`) || ""}
        value={item.comment}
      />
      <Image width={200} src={item.productDetail.image} preview={false} />
    </Space>
  );
};

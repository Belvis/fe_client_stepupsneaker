import { useCreateMany, useTranslate } from "@refinedev/core";
import {
  App,
  Button,
  Col,
  Empty,
  Grid,
  Modal,
  ModalProps,
  Row,
  Space,
} from "antd";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  IOrderResponse,
  IOrderDetailResponse,
  IProductDetailResponse,
  IOrderDetailRequest,
} from "../../../interfaces";
import { ProductDetailItem } from "./ProductDetailItem";
import ShoppingCartHeader from "./ShoppingCartHeader";
import { getDiscountPrice } from "../../../helpers/product";

type SelectedItemsModalProps = {
  modalProps: ModalProps;
  close: () => void;
  setViewOrder: Dispatch<SetStateAction<IOrderResponse>>;
  parentClose: () => void;
  setSelectedProductDetails: Dispatch<SetStateAction<IProductDetailResponse[]>>;
  items: IProductDetailResponse[];
  showAddAndGoButton: boolean;
};

export const SelectedItemsModal: React.FC<SelectedItemsModalProps> = ({
  modalProps,
  close,
  setViewOrder,
  setSelectedProductDetails,
  items,
  showAddAndGoButton,
  parentClose,
}) => {
  const t = useTranslate();
  const { message } = App.useApp();
  const breakpoint = Grid.useBreakpoint();

  const [copiedItems, setCopiedItems] =
    useState<IProductDetailResponse[]>(items);

  useEffect(() => {
    if (items) setCopiedItems([...items]);
  }, [modalProps.open]);

  const handleOk = async () => {
    setSelectedProductDetails(copiedItems);
    close();
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCopiedItems((prev) =>
      prev.map((detail) =>
        detail.id === productId ? { ...detail, quantity: newQuantity } : detail
      )
    );
  };

  const removeProductDetails = (productId: string) => {
    setCopiedItems((prev) => {
      return prev
        .map((detail) =>
          detail.id === productId
            ? { ...detail, quantity: detail.quantity - 1 }
            : detail
        )
        .filter((detail) => detail.quantity > 0);
    });
  };

  const handleSubmit = async () => {
    setViewOrder((prev) => {
      const payLoad = productDetailToOrderDetail(copiedItems, prev);
      let addition = 0;

      const updatedOrderDetails = prev.orderDetails.map((existingItem) => {
        const itemToUpdate = payLoad.find(
          (newItem) =>
            newItem.productDetail.id === existingItem.productDetail.id
        );

        if (itemToUpdate) {
          addition += itemToUpdate.quantity * existingItem.price;

          return {
            ...existingItem,
            quantity: existingItem.quantity + itemToUpdate.quantity,
            totalPrice:
              (existingItem.quantity + itemToUpdate.quantity) *
              existingItem.price,
          };
        }
        return existingItem;
      });

      const newItemsToAdd = payLoad.filter(
        (newItem) =>
          !prev.orderDetails.some(
            (existingItem) =>
              existingItem.productDetail.id === newItem.productDetail.id
          )
      );
      addition += newItemsToAdd.reduce(
        (accumulator, detail) => accumulator + detail.totalPrice,
        0
      );

      return {
        ...prev,
        orderDetails: [...updatedOrderDetails, ...newItemsToAdd],
        originMoney: prev.originMoney + addition,
        totalMoney: prev.totalMoney + addition,
      };
    });
    message.success(t("orders.notification.product.add.success"));
    parentClose();
  };

  return (
    <Modal
      title={t("products.titles.add")}
      {...modalProps}
      width={breakpoint.sm ? "800px" : "100%"}
      zIndex={1002}
      onOk={handleOk}
      okText={t("buttons.addAndContinue")}
      footer={(_, { OkBtn, CancelBtn }) => (
        <>
          <CancelBtn />
          <Button type="primary" onClick={handleSubmit}>
            {showAddAndGoButton ? t("buttons.go") : t("buttons.addAndGo")}
          </Button>
          <OkBtn />
        </>
      )}
    >
      <Row>
        <Col span={24}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <ShoppingCartHeader />
            {copiedItems.length > 0 ? (
              <div
                style={{
                  maxHeight: "300px",
                  overflow: "auto",
                }}
              >
                {copiedItems.map((item, index) => (
                  <ProductDetailItem
                    key={item.id}
                    productDetail={item}
                    callBack={updateQuantity}
                    onRemove={() => removeProductDetails(item.id)}
                    count={index}
                  />
                ))}
              </div>
            ) : (
              <Empty />
            )}
          </Space>
        </Col>
      </Row>
    </Modal>
  );
};

const orderDetailToPayload = (
  productDetails: IProductDetailResponse[],
  orderId: string
): IOrderDetailRequest[] => {
  return productDetails.map((detail) => ({
    order: orderId,
    productDetail: detail.id,
    quantity: detail.quantity,
    price: getPriceProductFinal(detail),
    totalPrice: getPriceProductFinal(detail) * detail.quantity,
    status: "COMPLETED",
  }));
};
const productDetailToOrderDetail = (
  productDetails: IProductDetailResponse[],
  order: IOrderResponse
): IOrderDetailResponse[] => {
  return productDetails.map((detail) => ({
    id: "",
    order: order,
    productDetail: detail,
    quantity: detail.quantity,
    price: getPriceProductFinal(detail),
    totalPrice: getPriceProductFinal(detail) * detail.quantity,
    status: "COMPLETED",
  }));
};

const getPriceProductFinal = (
  productDetail: IProductDetailResponse
): number => {
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

  const discountedPrice = getDiscountPrice(productDetail.price, discount);

  const finalProductPrice = +(productDetail.price * 1);
  const finalDiscountedPrice = +((discountedPrice ?? discount) * 1);
  return discountedPrice !== null ? finalDiscountedPrice : finalProductPrice;
};

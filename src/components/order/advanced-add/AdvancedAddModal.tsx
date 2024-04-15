import { PlusOutlined, SelectOutlined } from "@ant-design/icons";
import { NumberField, useModal, useTable } from "@refinedev/antd";
import { CrudFilters, HttpError, useTranslate } from "@refinedev/core";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  ColorPicker,
  Grid,
  Modal,
  ModalProps,
  Row,
  Space,
  Table,
  Typography,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import {
  IOrderResponse,
  IProductDetailFilterVariables,
  IProductDetailResponse,
} from "../../../interfaces";
import { SelectedItemsModal } from "./SelectedItemsModal";
import { ProductSearchForm } from "./ProductSearchForm";
import { getDiscountPrice } from "../../../helpers/product";
import { tablePaginationSettings } from "../../../constants/tablePaginationConfig";

const { Text } = Typography;

type AdvancedAddModalProps = {
  modalProps: ModalProps;
  setViewOrder: React.Dispatch<React.SetStateAction<IOrderResponse>>;
  close: () => void;
};

export const AdvancedAddModal: React.FC<AdvancedAddModalProps> = ({
  modalProps,
  setViewOrder,
  close,
}) => {
  const t = useTranslate();
  const breakpoint = Grid.useBreakpoint();

  const {
    tableProps,
    searchFormProps,
    current,
    pageSize,
    tableQueryResult: { refetch },
  } = useTable<
    IProductDetailResponse,
    HttpError,
    IProductDetailFilterVariables
  >({
    resource: `product-details`,
    syncWithLocation: false,
    pagination: {
      pageSize: 5,
    },
    sorters: {
      initial: [
        {
          field: "id",
          order: "desc",
        },
      ],
    },
    onSearch: ({
      q,
      status,
      brand,
      color,
      material,
      priceMax,
      priceMin,
      quantity,
      size,
      sole,
      style,
      tradeMark,
    }) => {
      const productDetailFilters: CrudFilters = [];

      productDetailFilters.push({
        field: "q",
        operator: "eq",
        value: q ? q : undefined,
      });

      productDetailFilters.push({
        field: "status",
        operator: "eq",
        value: status ? status : undefined,
      });

      productDetailFilters.push({
        field: "brands",
        operator: "eq",
        value: brand ? brand : undefined,
      });
      productDetailFilters.push({
        field: "colors",
        operator: "eq",
        value: color ? color : undefined,
      });
      productDetailFilters.push({
        field: "materials",
        operator: "eq",
        value: material ? material : undefined,
      });
      productDetailFilters.push({
        field: "sizes",
        operator: "eq",
        value: size ? size : undefined,
      });
      productDetailFilters.push({
        field: "soles",
        operator: "eq",
        value: sole ? sole : undefined,
      });
      productDetailFilters.push({
        field: "styles",
        operator: "eq",
        value: style ? style : undefined,
      });
      productDetailFilters.push({
        field: "tradeMarks",
        operator: "eq",
        value: tradeMark ? tradeMark : undefined,
      });
      productDetailFilters.push({
        field: "priceMin",
        operator: "eq",
        value: priceMin ? priceMin : undefined,
      });
      productDetailFilters.push({
        field: "priceMax",
        operator: "eq",
        value: priceMax ? priceMax : undefined,
      });
      productDetailFilters.push({
        field: "quantity",
        operator: "eq",
        value: quantity ? quantity : undefined,
      });

      return productDetailFilters;
    },
  });

  const [showAddAndGoButton, setShowAddAndGoButton] = useState(false);
  const {
    show: showItem,
    close: closeItem,
    modalProps: itemModalProps,
  } = useModal();

  const [selectedProductDetails, setSelectedProductDetails] = useState<
    IProductDetailResponse[]
  >([]);

  useEffect(() => {
    setSelectedProductDetails([]);
    refetch();
  }, [modalProps.open]);

  const addProductDetails = (
    productDetails: IProductDetailResponse | IProductDetailResponse[]
  ) => {
    setSelectedProductDetails((prevSelectedProductDetails) => {
      const updatedDetails = Array.isArray(productDetails)
        ? productDetails.map((detail) => ({ ...detail, quantity: 1 }))
        : [{ ...productDetails, quantity: 1 }];

      const existingIndex = prevSelectedProductDetails.findIndex(
        (existingDetail) => existingDetail.id === updatedDetails[0].id
      );

      if (existingIndex !== -1) {
        const newDetails = [...prevSelectedProductDetails];
        newDetails[existingIndex].quantity += 1;
        return newDetails;
      }

      return [...prevSelectedProductDetails, ...updatedDetails];
    });
  };

  const handleAddProductDetail: React.MouseEventHandler<HTMLElement> = () => {
    addProductDetails(selectedRows);
    setShowAddAndGoButton(false);
    showItem();
    setSelectedRows([]);
    setSelectedRowKeys([]);
  };

  const [selectedRows, setSelectedRows] = useState<IProductDetailResponse[]>(
    []
  );
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    selectedRows: IProductDetailResponse[]
  ) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(selectedRows);
  };

  const rowSelection = {
    preserveSelectedRowKeys: true,
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRows.length > 0;

  const columns: ColumnsType<IProductDetailResponse> = [
    {
      title: "#",
      key: "createdAt",
      dataIndex: "createdAt",
      sorter: {},
      width: "1px",
      align: "center",
      render: (text, record, index) => {
        const pageIndex = (current ?? 1) - 1;
        const calculatedIndex = pageIndex * pageSize + (index ?? 0) + 1;
        return calculatedIndex;
      },
    },
    {
      title: t("productDetails.fields.name"),
      dataIndex: "name",
      key: "name",
      render: (_, { image, product, size, color, promotionProductDetails }) => {
        const promotionProductDetailsActive = (
          promotionProductDetails ?? []
        ).filter((productDetail) => productDetail.promotion.status == "ACTIVE");

        const maxPromotionProductDetail = promotionProductDetailsActive.reduce(
          (maxProduct, currentProduct) => {
            return currentProduct.promotion.value > maxProduct.promotion.value
              ? currentProduct
              : maxProduct;
          },
          promotionProductDetailsActive[0]
        );

        if (promotionProductDetailsActive.length > 0) {
          const value = maxPromotionProductDetail.promotion.value;
          return (
            <Row style={{ display: "flex", alignItems: "center" }}>
              <Col span={6}>
                <Badge.Ribbon text={`${value}%`} color="red" placement="start">
                  <Avatar shape="square" size={74} src={image} />
                </Badge.Ribbon>
              </Col>
              <Col span={18}>
                <Text style={{ wordBreak: "inherit" }}>
                  {product.name} [{size.name} - {color.name}]
                </Text>
              </Col>
            </Row>
          );
        } else {
          return (
            <Row style={{ display: "flex", alignItems: "center" }}>
              <Col span={6}>
                <Avatar shape="square" size={74} src={image} />
              </Col>
              <Col span={18}>
                <Text style={{ wordBreak: "inherit" }}>
                  {product.name} [{size.name} - {color.name}]
                </Text>
              </Col>
            </Row>
          );
        }
      },
    },
    {
      title: t("productDetails.fields.quantity"),
      key: "quantity",
      sorter: {},
      dataIndex: "quantity",
      align: "center",
    },
    {
      title: t("productDetails.fields.price"),
      key: "price",
      sorter: {},
      dataIndex: "price",
      align: "center",
      render: (_, productDetail) => {
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
        return (
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
        );
      },
    },
    {
      title: t("productDetails.fields.size"),
      key: "size",
      dataIndex: "size",
      sorter: {},
      align: "center",
      render: (_, record) => (
        <Text style={{ width: "100%" }}>{record.size.name}</Text>
      ),
    },
    {
      title: t("productDetails.fields.color"),
      key: "color",
      dataIndex: "color",
      sorter: {},
      align: "center",
      render: (_, record) => (
        <ColorPicker defaultValue={record.color.code} showText disabled />
      ),
    },
  ];

  return (
    <Modal
      title={t("pos.titles.advancedAdd")}
      {...modalProps}
      width={breakpoint.sm ? "1300px" : "100%"}
      zIndex={1001}
      footer={<></>}
    >
      <Row gutter={[10, 10]}>
        <Col span={24}>
          <Card>
            <ProductSearchForm formProps={searchFormProps} />
          </Card>
        </Col>
        <Col span={24}>
          <Card
            title={
              <Space>
                <span>{t("productDetails.list")}</span>
                {hasSelected && (
                  <span>
                    |{" "}
                    {t("table.selection", {
                      count: selectedRowKeys.length,
                    })}
                  </span>
                )}
              </Space>
            }
            style={{ marginTop: "0.5rem" }}
            extra={
              <Space>
                <Button
                  icon={<SelectOutlined />}
                  onClick={() => {
                    setShowAddAndGoButton(true);
                    showItem();
                  }}
                >
                  {t("buttons.checkSelected")}
                </Button>
                <Button
                  disabled={!hasSelected}
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddProductDetail}
                >
                  {t("actions.add")}
                </Button>
              </Space>
            }
          >
            <Table
              rowSelection={rowSelection}
              {...tableProps}
              pagination={{
                ...tableProps.pagination,
                ...tablePaginationSettings,
              }}
              rowKey="id"
              columns={columns}
            />
          </Card>
        </Col>
      </Row>
      <SelectedItemsModal
        modalProps={itemModalProps}
        close={closeItem}
        parentClose={close}
        setViewOrder={setViewOrder}
        setSelectedProductDetails={setSelectedProductDetails}
        items={selectedProductDetails}
        showAddAndGoButton={showAddAndGoButton}
      />
    </Modal>
  );
};

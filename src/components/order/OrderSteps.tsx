import {
  CarOutlined,
  CheckOutlined,
  DropboxOutlined,
  FileProtectOutlined,
  LoadingOutlined,
  QuestionOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { useTranslate } from "@refinedev/core";
import { Card, Grid, Skeleton, Steps, Tooltip } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
  IEvent,
  IOrderHistoryResponse,
  IOrderResponse,
  OrderStatus,
} from "../../interfaces";
import { MdPendingActions } from "react-icons/md";

const { useBreakpoint } = Grid;

type OrderStepsProps = {
  record: IOrderResponse;
  callBack: any;
};

export const OrderSteps: React.FC<OrderStepsProps> = ({ record, callBack }) => {
  const t = useTranslate();
  const screens = useBreakpoint();
  const currentBreakPoints = Object.entries(screens)
    .filter((screen) => !!screen[1])
    .map((screen) => screen[0]);

  const notFinishedCurrentStep = (event: IEvent, index: number) =>
    event.status !== "CANCELED" &&
    event.status !== "COMPLETED" &&
    event.status !== "RETURNED" &&
    event.loading;

  const stepStatus = (event: IEvent, index: number) => {
    if (!event.date) return "wait";
    if (
      event.status === "CANCELED" ||
      (event.status === "RETURNED" && index === events.length - 1)
    )
      return "error";
    if (notFinishedCurrentStep(event, index)) return "process";
    return "finish";
  };

  const [events, setEvents] = useState<IEvent[]>([]);

  useEffect(() => {
    if (record) {
      console.log("record", record);

      const orderHistories = record.orderHistories;
      const updatedEvents = getOrderStatusTimeline(orderHistories);
      setEvents(updatedEvents);
    }
  }, [record]);

  return (
    <Card
      styles={{
        body: {
          padding: 0,
        },
      }}
    >
      <div
        className="card-container"
        style={{
          overflowX: "auto",
          whiteSpace: "nowrap",
        }}
      >
        {record && (
          <Steps
            direction={
              currentBreakPoints.includes("lg") ? "horizontal" : "vertical"
            }
            current={events.findIndex((el) => el.status === record?.status)}
          >
            {events.map((event: IEvent, index: number) => (
              <Steps.Step
                status={stepStatus(event, index)}
                key={index}
                title={t(`order_tracking.order_status.${event.status}`)}
                icon={
                  notFinishedCurrentStep(event, index) ? (
                    <LoadingOutlined />
                  ) : (
                    getIconByStatus(event.status)
                  )
                }
                style={{
                  minWidth: "300px",
                  padding: "24px",
                }}
                description={event.note && event.note}
                subTitle={
                  <Tooltip
                    title={
                      event.date && dayjs(new Date(event.date)).format("LLL")
                    }
                  >
                    {event.date && dayjs(new Date(event.date)).format("DD/MM")}
                  </Tooltip>
                }
              />
            ))}
          </Steps>
        )}
        {!record && <Skeleton paragraph={{ rows: 1 }} />}
      </div>
    </Card>
  );
};

const getOrderStatusTimeline = (
  orderHistories: IOrderHistoryResponse[]
): IEvent[] => {
  const statusList: OrderStatus[] = [
    "PENDING",
    "WAIT_FOR_CONFIRMATION",
    "WAIT_FOR_DELIVERY",
    "DELIVERING",
    "COMPLETED",
  ];
  const eventList: IEvent[] = [];

  const exceptionStatusList: OrderStatus[] = [
    "CANCELED",
    "EXCHANGED",
    "EXPIRED",
    "RETURNED",
  ];

  let remainingStatus = [...statusList];
  let lastStatus: OrderStatus = "PENDING";

  orderHistories.forEach((history, index) => {
    const { actionStatus, createdAt, note } = history;

    if (index !== orderHistories.length - 1) {
      eventList.push({ status: actionStatus, date: createdAt, note });
      lastStatus = actionStatus;
    } else {
      if (!exceptionStatusList.includes(actionStatus)) {
        lastStatus = actionStatus;
      }

      const lastIndex = remainingStatus.indexOf(lastStatus);
      remainingStatus = remainingStatus.slice(lastIndex + 1);
      eventList.push({
        status: actionStatus,
        date: createdAt,
        loading: true,
        note,
      });
    }
  });

  // Thêm các trạng thái chưa xử lý vào eventList với giá trị date là null
  remainingStatus.forEach((status) => {
    eventList.push({ status, date: undefined });
  });

  // Sắp xếp eventList theo thời gian tăng dần
  eventList.sort((a, b) => (a.date || Infinity) - (b.date || Infinity));

  return eventList;
};

const getIconByStatus = (status: OrderStatus) => {
  switch (status) {
    case "PLACE_ORDER":
      return <DropboxOutlined />;
    case "WAIT_FOR_CONFIRMATION":
      return <QuestionOutlined />;
    case "WAIT_FOR_DELIVERY":
      return <CheckOutlined />;
    case "DELIVERING":
      return <CarOutlined />;
    case "COMPLETED":
      return <FileProtectOutlined />;
    case "RETURNED":
      return <StopOutlined />;
    case "PENDING":
      return <MdPendingActions />;
    default:
      return null;
  }
};

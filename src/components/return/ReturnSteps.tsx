import {
  AlertOutlined,
  CarryOutOutlined,
  FileProtectOutlined,
  LoadingOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { useTranslate } from "@refinedev/core";
import { Card, Grid, Skeleton, Steps, Tooltip } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { DeliveryStatus, IReturnEvent, IReturnFormHistoryResponse, IReturnFormResponse } from "../../interfaces";

const { useBreakpoint } = Grid;

type ReturnStepsProps = {
  record: IReturnFormResponse;
};

export const ReturnSteps: React.FC<ReturnStepsProps> = ({ record }) => {
  const t = useTranslate();
  const screens = useBreakpoint();
  const currentBreakPoints = Object.entries(screens)
    .filter((screen) => !!screen[1])
    .map((screen) => screen[0]);

  const notFinishedCurrentStep = (event: IReturnEvent, index: number) => event.status !== "COMPLETED" && event.loading;

  const stepStatus = (event: IReturnEvent, index: number) => {
    if (!event.date) return "wait";
    if (notFinishedCurrentStep(event, index)) return "process";
    return "finish";
  };

  const [events, setEvents] = useState<IReturnEvent[]>([]);

  useEffect(() => {
    if (record) {
      const returnFormHistories = record.returnFormHistories;
      const updatedEvents = getReturnStatusTimeline(returnFormHistories);
      setEvents(updatedEvents);
    }
  }, [record]);

  return (
    <Card
      bordered={false}
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
            direction={currentBreakPoints.includes("lg") ? "horizontal" : "vertical"}
            current={events.findIndex((el) => el.status === record?.returnDeliveryStatus)}
          >
            {events.map((event: IReturnEvent, index: number) => (
              <Steps.Step
                status={stepStatus(event, index)}
                key={index}
                title={t(`return-forms.fields.returnDeliveryStatus.${event.status}`)}
                icon={notFinishedCurrentStep(event, index) ? <LoadingOutlined /> : getIconByStatus(event.status)}
                style={{
                  minWidth: "300px",
                  padding: "24px",
                }}
                description={event.note && event.note}
                subTitle={
                  <Tooltip title={event.date && dayjs(new Date(event.date)).format("LLL")}>
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

const getReturnStatusTimeline = (returnFormHistories: IReturnFormHistoryResponse[]): IReturnEvent[] => {
  const statusList: DeliveryStatus[] = ["PENDING", "RETURNING", "RECEIVED", "RETURNING", "RECEIVED", "COMPLETED"];
  const eventList: IReturnEvent[] = [];

  const exceptionStatusList: DeliveryStatus[] = [];

  let remainingStatus = [...statusList];
  let lastStatus: DeliveryStatus = "PENDING";

  returnFormHistories.forEach((history, index) => {
    const { actionStatus, createdAt, note } = history;

    if (index !== returnFormHistories.length - 1) {
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

const getIconByStatus = (status: DeliveryStatus) => {
  switch (status) {
    case "PENDING":
      return <AlertOutlined />;
    case "RETURNING":
      return <RocketOutlined />;
    case "RECEIVED":
      return <CarryOutOutlined />;
    case "COMPLETED":
      return <FileProtectOutlined />;
    default:
      return null;
  }
};

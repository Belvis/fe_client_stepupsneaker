import dayjs from "dayjs";

export function toTimeStamp(date: string) {
  return dayjs(date).valueOf();
}

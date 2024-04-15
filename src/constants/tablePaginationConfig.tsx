import React from "react";
import { TablePaginationConfig } from "antd";
import { useTranslation } from "react-i18next";

const PaginationTotal = ({
  total,
  range,
}: {
  total: number;
  range: [number, number];
}) => {
  const { t } = useTranslation();

  return (
    <div>
      {t("table.pagination.showTotal", {
        start: range[0],
        end: range[1],
        total,
      })}
    </div>
  );
};

export const tablePaginationSettings: TablePaginationConfig = {
  pageSizeOptions: [5, 10, 20, 50, 100],
  showQuickJumper: true,
  showSizeChanger: true,
  showTotal(total: number, range: [number, number]): React.ReactNode {
    return <PaginationTotal total={total} range={range} />;
  },
};

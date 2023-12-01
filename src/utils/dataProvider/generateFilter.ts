import { CrudFilters } from "@refinedev/core";
import { mapOperator } from "./mapOperator";

export const generateFilter = (filters?: CrudFilters) => {
  const queryFilters: { [key: string]: string } = {};

  if (filters) {
    filters.map((filter) => {
      if (filter.operator === "or" || filter.operator === "and") {
        throw new Error(
          `[@refinedev/simple-rest]: \`operator: ${filter.operator}\` is not supported. You can create custom data provider. https://refine.dev/docs/api-reference/core/providers/data-provider/#creating-a-data-provider`
        );
      }

      if ("field" in filter) {
        const { field, operator, value } = filter;

        if (field === "q") {
          queryFilters[field] = value;
          return;
        }

        const mappedOperator = mapOperator(operator);
        queryFilters[`${field}${mappedOperator}`] = value;
      }
    });
  }

  return queryFilters;
};

export const generateFilterParams = (filters?: CrudFilters) => {
  const params = new URLSearchParams();

  if (filters) {
    filters.forEach((filter, index) => {
      if ("field" in filter) {
        const { field, operator, value } = filter;
        params.append(`filters[${index}][field]`, field);
        params.append(`filters[${index}][operator]`, operator);

        if (Array.isArray(value)) {
          value.forEach((value, valueIndex) => {
            params.append(`filters[${index}][value][${valueIndex}]`, value);
          });
        } else {
          params.append(`filters[${index}][value]`, value);
        }
      }
    });
  }

  return params;
};

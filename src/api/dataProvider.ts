import { AxiosInstance } from "axios";
import { stringify } from "query-string";
import { DataProvider } from "@refinedev/core";
import { axiosInstance, generateSort, generateFilter } from "../utils";

type MethodTypes = "get" | "delete" | "head" | "options";
type MethodTypesWithBody = "post" | "put" | "patch";

export const dataProvider = (
  apiUrl: string,
  httpClient: AxiosInstance = axiosInstance
): Omit<Required<DataProvider>, "updateMany" | "deleteMany"> => ({
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    const url = `${apiUrl}/${resource}`;

    const { current = 1, pageSize, mode = "server" } = pagination ?? {};

    const { headers: headersFromMeta, method } = meta ?? {};
    const requestMethod = (method as MethodTypes) ?? "get";

    const queryFilters = generateFilter(filters);

    const query: {
      page?: number;
      pageSize?: number;
      sortBy?: string;
      orderBy?: string;
    } = {
      sortBy: "updatedAt",
    };

    if (mode === "server") {
      query.page = current - 1;
      query.pageSize = pageSize;
    }

    const generatedSort = generateSort(sorters);
    if (generatedSort) {
      const { sortBy, orderBy } = generatedSort;
      query.sortBy = sortBy.join(",");
      query.orderBy = orderBy.join(",");
    }

    const response = await httpClient[requestMethod](
      `${url}?${stringify(query)}&${stringify(queryFilters)}`,
      {
        headers: headersFromMeta,
      }
    );

    const { content } = response.data;
    const data = content.data;
    const totalElements = content.totalElements;
    const startIndex =
      pageSize !== undefined && current !== undefined
        ? (current + 1) * pageSize
        : 0;

    return {
      data: data,
      total: totalElements,
      startIndex,
    };
  },

  getMany: async ({ resource, ids, meta }) => {
    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypes) ?? "get";

    const { data } = await httpClient[requestMethod](
      `${apiUrl}/${resource}?${stringify({ id: ids })}`,
      { headers }
    );

    return {
      data,
    };
  },

  create: async ({ resource, variables, meta }) => {
    const url = `${apiUrl}/${resource}`;

    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypesWithBody) ?? "post";

    const response = await httpClient[requestMethod](url, variables, {
      headers,
    });

    const data = response.data.content;

    return {
      data,
    };
  },

  createMany: async ({ resource, variables, meta }) => {
    const url = `${apiUrl}/${resource}`;

    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypesWithBody) ?? "post";

    const response = await httpClient[requestMethod](url, variables, {
      headers,
    });

    const { content } = response.data;
    const data = content;

    return {
      data,
    };
  },

  update: async ({ resource, id, variables, meta }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypesWithBody) ?? "put";

    const { data } = await httpClient[requestMethod](url, variables, {
      headers,
    });

    return {
      data,
    };
  },

  getOne: async ({ resource, id, meta }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    const { headers, method } = meta ?? {};

    const requestMethod = (method as MethodTypes) ?? "get";

    const response = await httpClient[requestMethod](url, { headers });

    const { content } = response.data;

    const data = content;

    return {
      data,
    };
  },

  deleteOne: async ({ resource, id, variables, meta }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypesWithBody) ?? "delete";

    const response = await httpClient[requestMethod](url, {
      data: variables,
      headers,
    });

    const { content } = response.data;

    const data = content;

    return {
      data,
    };
  },

  getApiUrl: () => {
    return apiUrl;
  },

  custom: async ({
    url,
    method,
    filters,
    sorters,
    payload,
    query,
    headers,
  }) => {
    let requestUrl = `${url}?`;

    if (sorters) {
      const generatedSort = generateSort(sorters);
      if (generatedSort) {
        const { sortBy, orderBy } = generatedSort;
        const sortQuery = {
          sortBy: sortBy.join(","),
          orderBy: orderBy.join(","),
        };
        requestUrl = `${requestUrl}&${stringify(sortQuery)}`;
      }
    }

    if (filters) {
      const filterQuery = generateFilter(filters);
      requestUrl = `${requestUrl}&${stringify(filterQuery)}`;
    }

    if (query) {
      requestUrl = `${requestUrl}&${stringify(query)}`;
    }

    let axiosResponse;
    switch (method) {
      case "put":
      case "post":
      case "patch":
        axiosResponse = await httpClient[method](url, payload, {
          headers,
        });
        break;
      case "delete":
        axiosResponse = await httpClient.delete(url, {
          data: payload,
          headers: headers,
        });
        break;
      default:
        axiosResponse = await httpClient.get(requestUrl, {
          headers,
        });
        break;
    }

    const data = axiosResponse.data.content;
    const response = axiosResponse.data;

    return Promise.resolve({ data, response });
  },
});

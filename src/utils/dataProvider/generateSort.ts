import { CrudSorting } from "@refinedev/core";

export const generateSort = (sorters?: CrudSorting) => {
  if (sorters && sorters.length > 0) {
    const sortBy: string[] = [];
    const orderBy: string[] = [];

    sorters.map((item) => {
      sortBy.push(item.field);
      orderBy.push(item.order);
    });

    return {
      sortBy,
      orderBy,
    };
  }

  return;
};

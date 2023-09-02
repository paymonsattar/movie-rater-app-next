export const paginate = (page: number, limit: number) => {
  // Treat negative or zero page numbers as page 1
  page = Math.max(1, page);

  // Treat negative limit as no limit (0)
  limit = Math.max(0, limit);

  const offset = (page - 1) * limit;

  return {
    offset,
    limit,
  };
};

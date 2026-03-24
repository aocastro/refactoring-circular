export function usePagination<T>(items: T[], itemsPerPage: number, page: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const safePage = Math.min(page, totalPages);
  const paginatedItems = items.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);
  return { paginatedItems, totalPages, safePage, totalItems: items.length };
}

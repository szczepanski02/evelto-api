export interface IPageableResponse<T> {
  data: T,
  currentPage?: number,
  itemsPerPage?: number,
  filterBy?: string,
  filterValue?: string,
  totalItems: number
}
import { IPageable } from '../interfaces/IPageable';
export const pageableResponseObject = <T>(pageableSetup: IPageable, total: number, data: T) => {
  if(pageableSetup.filterBy === 'id') pageableSetup.filterBy = undefined;
  return {
    data,
    currentPage: pageableSetup.currentPage,
    itemsPerPage: pageableSetup.itemsPerPage,
    totalItems: total,
    filterBy: pageableSetup.filterBy,
    filterValue: pageableSetup.filterValue
  }
}
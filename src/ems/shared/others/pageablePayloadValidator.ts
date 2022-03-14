import { IPageable } from '../interfaces/IPageable';
export const pageablePayloadValidator = (pageablePayload: IPageable) => {

  if(!pageablePayload.currentPage) pageablePayload.currentPage = 0;
  if(!pageablePayload.filterBy) pageablePayload.filterBy = 'id';
  if(!pageablePayload.filterValue) pageablePayload.filterValue = undefined;
  if(!pageablePayload.itemsPerPage) pageablePayload.itemsPerPage = 10;

  +pageablePayload.currentPage;
  +pageablePayload.itemsPerPage;

  return pageablePayload;

}
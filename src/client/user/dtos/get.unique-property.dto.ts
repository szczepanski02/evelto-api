export class GetUniquePropertyDto {
  propertyName: UserUniquePropertyEnum;
  propertyValue: string | number;
}

export enum UserUniquePropertyEnum {
  username = 'username',
  id = 'id',
  email = 'email'
}
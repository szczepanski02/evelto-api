export class CreateEmployeeDto {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;

  createdBy?: string;
}
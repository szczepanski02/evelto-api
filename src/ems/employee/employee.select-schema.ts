export const employeeSelectSchemaAll = {
  id: true,
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  email: true,
  profileImg: true,
  isActive: true,
  ipVerification: true,
  createdAt: true,
  createdBy: true,
  authority: true
}

export const employeeSelectSchemaPageable = {
  username: true,
  firstName: true,
  lastName: true,
  email: true,
  authority: true,
  isActive: true,
  ipVerification: true
}

export const employeeSelectSchemaWithoutPassword = {
  id: true,
  username: true,
  firstName: true,
  lastName: true,
  email: true,
  profileImg: true,
  isActive: true,
  ipVerification: true,
  createdAt: true,
  createdBy: true,
  authority: true
}
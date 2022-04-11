export const userSelectSchemaAll = {
  id: true,
  username: true,
  firstName: true,
  lastName: true,
  password: false,
  lang: true,
  email: true,
  isActive: true,
  createdBy: true,
  accountType: true,
  refreshTokens: true,
  userDetails: {
    select: {
      profileImg: true,
      birthDate: true,
      gender: true,
      createdAt: true,
      userAddress: true,
      phoneNumber: true
    }
  },
  creatorDetails: true
}

export const userIncludeAll = {
  refreshTokens: true,
  userDetails: true
}

export interface IUserSelect {
  id: boolean,
  username: boolean,
  password: boolean,
  firstName: boolean,
  lastName: boolean,
  email: boolean,
  lang: boolean,
  isActive: boolean,
  accountType: boolean,
  userDetails: any;
  refreshTokens: boolean;
  creatorDetails: boolean;
  createdBy: boolean;
}

export interface IUserInclude {
  refreshTokens: boolean;
  userDetails: boolean;
  creatorDetails: boolean;
}
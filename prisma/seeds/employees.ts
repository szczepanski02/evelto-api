import { Authority } from "@prisma/client";

export const initialSeedEmployees = [
  {
    username: 'admin',
    password: 'admin',
    firstName: 'Admin',
    lastName: 'Account',
    email: 'admin@domain.com',
    isActive: true,
    ipVerification: false,
    createdBy: 'SERVER_ROOT',
    authority: Authority.ADMIN
  },
  {
    username: 'moderator',
    password: 'moderator',
    firstName: 'Moderator',
    lastName: 'Account',
    email: 'moderator@domain.com',
    isActive: true,
    ipVerification: false,
    createdBy: 'admin',
    authority: Authority.MODERATOR
  },
  {
    username: 'rszczepanski',
    password: 'admin',
    firstName: 'Radosław',
    lastName: 'Szczepański',
    email: 'r.szczepanski02@domain.com',
    isActive: true,
    ipVerification: false,
    createdBy: 'SERVER_ROOT',
    authority: Authority.ROOT
  }
]
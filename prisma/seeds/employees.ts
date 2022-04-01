import { Authority } from "@prisma/client";
import * as bcrypt from "bcrypt";

export const initialSeedEmployees = [
  {
    username: 'admin',
    password: bcrypt.hashSync('admin', 10),
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
    password: bcrypt.hashSync('moderator', 10),
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
    password: bcrypt.hashSync('admin', 10),
    firstName: 'Radosław',
    lastName: 'Szczepański',
    email: 'r.szczepanski02@domain.com',
    isActive: true,
    ipVerification: false,
    createdBy: 'SERVER_ROOT',
    authority: Authority.ROOT
  }
]
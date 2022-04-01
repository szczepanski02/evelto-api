import { CreatedByStrategies, Lang, Gender } from '.prisma/client';
import { ClientIsActive, AccountType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export const initialSeedUsers = [
  {
    username: 'rszczepanski',
    firstName: 'Radosław',
    lastName: 'Szczepański',
    email: 'r.szczepanski02@gmail.com',
    isActive: ClientIsActive.IS_ACTIVE,
    createdBy: CreatedByStrategies.GOOGLE,
    lang: Lang.en,
    accountType: AccountType.CREATOR,
    userDetails: {
      create: {
        gender: Gender.MALE,
        phoneNumber: '+48 733 593 336',
        createdAt: new Date(),
        userAddress: {
          create: {
            country: 'Poland',
            city: 'Rudawa',
            zipCode: '32-064',
            address1: 'Krótka 7'
          }
        },
      },
    },
    creatorDetails: {
      create: {
        verificated: true
      }
    }
  },
  {
    username: 'jan.kowalski',
    password: bcrypt.hashSync('kowalski', 10),
    firstName: 'Jan',
    lastName: 'Kowalski',
    email: 'jan.kowalski@domain.com',
    isActive: ClientIsActive.IS_ACTIVE,
    createdBy: CreatedByStrategies.LOCAL,
    lang: Lang.pl,
    accountType: AccountType.CREATOR,
    userDetails: {
      create: {
        gender: Gender.MALE,
        createdAt: new Date(),
        userAddress: {
          create: {
            country: 'Poland',
            city: 'Cracow',
            zipCode: '30-220',
            address1: 'Wrocławska 22'
          }
        }
      }
    },
    creatorDetails: {
      create: {
        verificated: true
      }
    }
  },
  {
    username: 'austin001',
    firstName: 'Austin',
    lastName: 'Park',
    email: 'austin.park001@gmail.com',
    isActive: ClientIsActive.IS_ACTIVE,
    createdBy: CreatedByStrategies.GOOGLE,
    lang: Lang.en,
    accountType: AccountType.CREATOR,
    userDetails: {
      create: {
        gender: Gender.MALE,
        createdAt: new Date(),
        phoneNumber: '(469) 536-4663',
        userAddress: {
          create: {
            country: 'China',
            city: 'Munster',
            zipCode: '123678',
            address1: 'Pede. St. 976-4803'
          }
        }
      }
    },
    creatorDetails: {
      create: {
        verificated: true
      }
    }
  }
]
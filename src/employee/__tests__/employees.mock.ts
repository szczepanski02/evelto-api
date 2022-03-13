import { Authority } from '@prisma/client';
export const employeesMock = [
  {
    id: 1,
    username: 'jkowalski',
    password: '1231dsa@!#aso2',
    firstName: 'Jan',
    lastName: 'Kowalski',
    email: 'jkowalski@domain.com',
    profileImg: null,
    authority: Authority.ADMIN,
    isActive: true,
    createdAt: new Date(),
    createdBy: 'rszczepanski',
    ipVerification: true,
    verificatedIPs: [
      {
        id: 1,
        address: '127.0.0.1',
        employeeId: 1
      }
    ],
    ipRequests: [
      {
        id: 1,
        address: '192.168.0.1',
        createdAt: new Date(),
        createdBy: 1
      }
    ]
    
  },
  {
    id: 1,
    username: 'pawelo011',
    password: '1dai1221@DOAk32g6$%2e2',
    firstName: 'Paweł',
    lastName: 'Tomaszewski',
    email: 'p.tomaszewski@domain.com',
    profileImg: null,
    authority: Authority.ROOT,
    isActive: true,
    createdAt: new Date(),
    createdBy: 'rszczepanski',
    ipVerification: false,
    verificatedIPs: [],
    ipRequests: []
  }
]
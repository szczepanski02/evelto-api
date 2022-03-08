<h1 align="center">(EMS) Evelto Management System</h1>
<h2 align="center">BACKEND</h2>

## Project setup:

- npm
- framework: nestjs 8.0.0,
- database: postgresql
- ORM package: prisma
- tests: jest

## How to start application (first time):

- npm install
- npm run db:init
- npm run start:local-db (docker-compose up)
- npm run start:dev
- npm run db:live (optional)

## Database workflow:

- create new model (update existing) inside prisma/schema.prisma
- npm run db:migrate (name of model)
- npm run db:generate (updating @prisma/client content)

## Authorization:

### Roles:

- ROOT
- ADMIN
- MODERATOR
- IT_SUPPORT
- DATA_SUPPORT
- CLIENT_SUPPORT

### Route protection:

- no specify role: @UseGuards(AuthoritiesGuard())
- only admin (route had default access) @UseGuards(AuthoritiesGuard(['ADMIN']))
- group of roles: @UseGuards(AuthoritiesGuard(['ADMIN', 'MODERATOR', 'IT_SUPPORT']))

## Authentication:

jsonwebtoken - localstorage - 15m expiration

### Routes:

All routes are visible in rest directory.

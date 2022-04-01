import { initialSeedUsers } from './users';
import { initialSeedEmployees } from './employees';
import { AccountType, ClientIsActive, CreatedByStrategies, Gender, Lang, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.employee.createMany({
    data: initialSeedEmployees
  });
  initialSeedUsers.forEach(async user => {
    await prisma.user.create({
      data: user
    });
  });

}

main().catch((e: any) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
import { PrismaClientModule } from './../../prisma-client/prisma-client.module';
import { Module } from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { UserManagementController } from './user-management.controller';

@Module({
  imports: [PrismaClientModule],
  controllers: [UserManagementController],
  providers: [UserManagementService]
})
export class UserManagementModule {}

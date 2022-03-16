import { Module } from '@nestjs/common';
import { PrismaClientModule } from './prisma-client/prisma-client.module';
import { EmsModule } from './ems/ems.module';
import { ClientModule } from './client/client.module';

@Module({
  imports: [PrismaClientModule, EmsModule, ClientModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

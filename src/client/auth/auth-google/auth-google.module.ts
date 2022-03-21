import { UserModule } from './../../user/user.module';
import { forwardRef, Module } from '@nestjs/common';
import { AuthGoogleService } from './auth-google.service';
import { AuthGoogleController } from './auth-google.controller';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';
import { AuthModule } from '../auth.module';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    PrismaClientModule,
    UserModule,
    forwardRef(() => AuthModule)
  ],
  controllers: [AuthGoogleController],
  providers: [AuthGoogleService, GoogleStrategy]
})
export class AuthGoogleModule {}

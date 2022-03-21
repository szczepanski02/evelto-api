import { ClientJwtAuthStrategy } from './stategies/client-jwt-auth.strategy';
import { PrismaClientModule } from '../../prisma-client/prisma-client.module';
import { UserModule } from './../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGoogleModule } from './auth-google/auth-google.module';
import { AuthFacebookModule } from './auth-facebook/auth-facebook.module';
import { ClientJwtService } from './client-jwt.service';
import { ClientLocalStrategy } from './stategies/client-local.strategy';

@Module({
  imports: [
    PrismaClientModule,
    AuthGoogleModule,
    AuthFacebookModule,
    JwtModule.register({}),
    UserModule,
    CacheModule.register()
  ],
  controllers: [
    AuthController,
  ],
  providers: [AuthService, ClientJwtService, ClientJwtAuthStrategy, ClientLocalStrategy],
  exports: [AuthService, ClientJwtService]
})
export class AuthModule {}

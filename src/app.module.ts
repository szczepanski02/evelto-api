import { Module } from '@nestjs/common';
import { PrismaClientModule } from './prisma-client/prisma-client.module';
import { EmsModule } from './ems/ems.module';
import { ClientModule } from './client/client.module';
import { HeaderResolver, I18nJsonParser, I18nModule } from 'nestjs-i18n';
import * as path from 'path';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      parser: I18nJsonParser,
      parserOptions: {
        path: path.join(__dirname, '/../i18n/'),
        watch: true
      },
      resolvers: [
        new HeaderResolver(['x-custom-lang'])
      ]
    }),
    PrismaClientModule,
    EmsModule,
    ClientModule
  ],
  controllers: []
})
export class AppModule {}

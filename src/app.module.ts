import { Module } from '@nestjs/common';
import { TelegramService } from './telegram/telegram.service';
import { TelegramModule } from './telegram/telegram.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [TelegramModule, ConfigModule.forRoot({ isGlobal: true })],
  providers: [TelegramService, PrismaService],
})
export class AppModule {}

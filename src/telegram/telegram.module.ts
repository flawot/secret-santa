import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { ConfigModule } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { CommandHandler } from './command.handler';
import { ButtonHandler } from './button.handler';
import { PrismaService } from 'src/prisma/prisma.service';
import { session } from 'telegraf';
import { RegisterScene } from './register.scene';
import { WishesScene } from './wishes.scene';
import { NameScene } from './name.scene';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TelegrafModule.forRoot({
      token: process.env.TELEGRAM_TOKEN!,
      middlewares: [session()],
    }),
  ],
  providers: [
    TelegramService,
    CommandHandler,
    ButtonHandler,
    PrismaService,
    RegisterScene,
    WishesScene,
    NameScene,
  ],
  exports: [TelegramService],
})
export class TelegramModule {}

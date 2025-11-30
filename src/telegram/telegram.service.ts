import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectBot, Update } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';

@Update()
@Injectable()
export class TelegramService implements OnModuleInit {
  constructor(@InjectBot() private bot: Telegraf) {}

  async onModuleInit() {
    await this.bot.telegram.setMyCommands([
      {
        command: 'set_wishes',
        description: 'Устанавливает ваш список пожеланий для подарка',
      },
      {
        command: 'register',
        description: 'Регистрация в тайном санте',
      },
      {
        command: 'unregister',
        description: 'Отказ от участия в тайном санте',
      },
      {
        command: 'profile',
        description: 'Показывает данне которые вы указали для санты',
      },
      {
        command: 'set_name',
        description: 'Устанавливает ФИО если вы указали неправильно',
      },
    ]);
  }
}

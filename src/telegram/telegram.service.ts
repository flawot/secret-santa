import { Injectable } from '@nestjs/common';
import { Ctx, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Update()
@Injectable()
export class TelegramService {
  @Start()
  async Start(@Ctx() ctx: Context) {
    await ctx.reply('Привет!');
  }
}

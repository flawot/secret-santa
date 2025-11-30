import { Injectable } from '@nestjs/common';
import { Command, Ctx, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { welcome } from '../../config.json';

const initialState = welcome;

@Update()
@Injectable()
export class CommandHandler {
  @Start()
  async Start(@Ctx() ctx: Context) {
    await ctx.reply(initialState);
  }

  @Command('set_wishes')
  async SetWishes() {}
}

import { Injectable } from '@nestjs/common';
import { Command, Ctx, Start, Update } from 'nestjs-telegraf';
import { Context, Markup, Scenes } from 'telegraf';
import { welcome } from '../../config.json';
import { PrismaService } from 'src/prisma/prisma.service';

const initialState = welcome;

@Update()
@Injectable()
export class CommandHandler {
  constructor(private prisma: PrismaService) {}

  @Start()
  async Start(@Ctx() ctx: Context) {
    const keyboard = Markup.inlineKeyboard([
      [{ text: 'Участвовать', callback_data: 'register' }],
    ]);

    await ctx.reply(initialState, keyboard);
  }

  @Command('set_wishes')
  async SetWishes(@Ctx() ctx: Scenes.SceneContext) {
    await ctx.scene.enter('wishes');
  }

  @Command('unregister')
  async UnRegister(@Ctx() ctx: Context) {
    const user = await this.prisma.member.findUnique({
      where: { telegram: ctx.from?.id },
    });

    if (!user) {
      await ctx.reply(
        'Вы не зарегистрированы, чтобы принять участие пропишите /register',
      );
      return;
    }

    await this.prisma.member.delete({ where: { telegram: ctx.from?.id } });
    await ctx.reply('Вы успешно отказались от участия в тайном санте');
  }

  @Command('register')
  async Register(@Ctx() ctx: Scenes.SceneContext) {
    const user = await this.prisma.member.findUnique({
      where: { telegram: ctx.from?.id },
    });

    if (user) {
      await ctx.reply(
        'Вы уже участвуете в тайном санте!\nЧтобы отказатся от участия пропишите /unregister',
      );
      return;
    }

    await ctx.scene.enter('register');
  }

  @Command('santa')
  async Santa(@Ctx() ctx: Context) {
    if (ctx.from?.id !== 6580692836) return;

    await ctx.reply('Запускаю тайного санту!');
  }
}

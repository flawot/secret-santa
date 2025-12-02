import { Injectable } from '@nestjs/common';
import { Command, Ctx, InjectBot, Start, Update } from 'nestjs-telegraf';
import { Context, Markup, Scenes, Telegraf } from 'telegraf';
import { welcome } from '../../config.json';
import { PrismaService } from 'src/prisma/prisma.service';

const initialState = welcome;

@Update()
@Injectable()
export class CommandHandler {
  constructor(
    private prisma: PrismaService,
    @InjectBot() private bot: Telegraf,
  ) {}

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

  @Command('set_name')
  async SetName(@Ctx() ctx: Scenes.SceneContext) {
    await ctx.scene.enter('name');
  }

  @Command('unregister')
  async UnRegister(@Ctx() ctx: Context) {
    if (new Date() > new Date(2025, 12, 4)) {
      await ctx.reply(
        'Период регистрации был закончен и вы больше не можете сделать это',
      );
      return;
    }

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
    const users = await this.prisma.member.findMany();

    for (let i = 0; i < users.length; i++) {
      const connections = await this.prisma.connection.findMany();
      const user = users[i];

      const recipients = users.filter((u) => {
        const connection = connections.find((p) => p.recipientId === u.id);

        if (u.id === user.id) {
          return false;
        }

        if (connection) {
          return false;
        }
        return true;
      });

      if (recipients.length == 0) {
        await this.bot.telegram.sendMessage(
          `${user.telegram}`,
          'К сожалению нету свободных людей для вручения кому-то подарка',
        );
        return;
      }

      const recipient =
        recipients[Math.floor(Math.random() * recipients.length)];

      await this.bot.telegram.sendMessage(
        `${user.telegram}`,
        `Твой "подопечный" это ${recipient.name}\n\nЕго пожелания для подарка:\n${recipient.list}\n\nНапоминаю что сумма подарка должна быть от 500 до 1000 рублей. Желаю вам удачи`,
      );
      await this.prisma.connection.create({
        data: { giverId: user.id, recipientId: recipient.id },
      });
    }
  }

  @Command('profile')
  async Profile(@Ctx() ctx: Context) {
    const user = await this.prisma.member.findUnique({
      where: { telegram: ctx.from?.id },
    });

    if (!user) {
      await ctx.reply('Вы ещё не приняли участие в тайном санте! /register');
      return;
    }

    await ctx.reply(
      `Данные для вашего санты: \n\nФИО: ${user.name}\nПожелания: ${user.list || 'Отсутсвуют'}\n\nВы можете поменять имя или пожелания через /set_name или /set_wishes`,
    );
  }
}

import { Ctx, Scene, SceneEnter, On } from 'nestjs-telegraf';
import { PrismaService } from 'src/prisma/prisma.service';
import { Scenes } from 'telegraf';
import { Message } from 'telegraf/types';

interface RegisterSceneSession extends Scenes.SceneSessionData {
  name?: string;
}

type RegisterContext = Scenes.SceneContext<RegisterSceneSession>;

@Scene('wishes')
export class WishesScene {
  constructor(private prisma: PrismaService) {}

  @SceneEnter()
  async enter(@Ctx() ctx: RegisterContext) {
    await ctx.reply('Введите свои пожелания по подарку');
  }

  @On('text')
  async onText(@Ctx() ctx: RegisterContext) {
    const text = (ctx.message as Message.TextMessage).text;

    if (!ctx.from) return;

    try {
      await this.prisma.member.update({
        where: { telegram: ctx.from.id },
        data: { list: text },
      });

      await ctx.reply(`Вы успешно добавили список пожеланий!`);
      await ctx.scene.leave();
    } catch (error) {
      console.error('Error creating member:', error);
      await ctx.reply('Произошла ошибка при регистрации. Попробуйте позже.');
      await ctx.scene.leave();
    }
  }
}

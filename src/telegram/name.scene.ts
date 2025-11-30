import { Ctx, Scene, SceneEnter, On } from 'nestjs-telegraf';
import { PrismaService } from 'src/prisma/prisma.service';
import { Scenes } from 'telegraf';
import { Message } from 'telegraf/types';

interface RegisterSceneSession extends Scenes.SceneSessionData {
  name?: string;
}

type RegisterContext = Scenes.SceneContext<RegisterSceneSession>;

@Scene('name')
export class NameScene {
  constructor(private prisma: PrismaService) {}

  @SceneEnter()
  async enter(@Ctx() ctx: RegisterContext) {
    await ctx.reply(
      'Введите своё ФИО (Не вводите неправильные данные чтобы ваш санта понял кому дарить подарок)',
    );
  }

  @On('text')
  async onText(@Ctx() ctx: RegisterContext) {
    const text = (ctx.message as Message.TextMessage).text;

    if (!ctx.from) return;

    try {
      await this.prisma.member.update({
        where: { telegram: ctx.from.id },
        data: { name: text },
      });

      await ctx.reply(`Вы успешно обновили своё ФИО!`);
      await ctx.scene.leave();
    } catch (error) {
      console.error('Error creating member:', error);
      await ctx.reply('Произошла ошибка при смене ФИО. Попробуйте позже.');
      await ctx.scene.leave();
    }
  }
}

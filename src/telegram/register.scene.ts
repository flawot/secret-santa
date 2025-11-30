import { Ctx, Scene, SceneEnter, On } from 'nestjs-telegraf';
import { PrismaService } from 'src/prisma/prisma.service';
import { Scenes } from 'telegraf';
import { Message } from 'telegraf/types';

interface RegisterSceneSession extends Scenes.SceneSessionData {
  name?: string;
}

type RegisterContext = Scenes.SceneContext<RegisterSceneSession>;

@Scene('register')
export class RegisterScene {
  constructor(private prisma: PrismaService) {}

  @SceneEnter()
  async enter(@Ctx() ctx: RegisterContext) {
    if (new Date() > new Date(2025, 11, 4)) {
      await ctx.reply(
        'Период регистрации был закончен и вы больше не можете сделать это',
      );
      return;
    }

    await ctx.reply(
      'Введите своё ФИО (Не вводите неправильные данные чтобы ваш санта понял кому дарить подарок)',
    );
  }

  @On('text')
  async onText(@Ctx() ctx: RegisterContext) {
    const text = (ctx.message as Message.TextMessage).text;

    if (!ctx.from) return;

    // Добавьте проверку и обработку ошибок
    try {
      await this.prisma.member.create({
        data: {
          name: text,
          telegram: ctx.from.id,
        },
      });

      await ctx.reply(
        `Спасибо! Вы можете указать список пожеланий для своего санты через /set_wishes`,
      );
      await ctx.scene.leave();
    } catch (error) {
      console.error('Error creating member:', error);
      await ctx.reply('Произошла ошибка при регистрации. Попробуйте позже.');
      await ctx.scene.leave();
    }
  }
}

import { Injectable } from '@nestjs/common';
import { Action, Ctx, Update } from 'nestjs-telegraf';
import { PrismaService } from 'src/prisma/prisma.service';
import { Scenes } from 'telegraf';

@Update()
@Injectable()
export class ButtonHandler {
  constructor(private prisma: PrismaService) {}

  @Action('register')
  async register(@Ctx() ctx: Scenes.SceneContext) {
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
}

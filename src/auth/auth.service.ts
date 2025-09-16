import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    // В реальном приложении здесь должна быть проверка пароля
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    };
  }

  async register(email: string, name: string, password: string) {
    // В реальном приложении здесь должна быть хеширование пароля
    const user = await this.prisma.user.create({
      data: {
        email,
        name,
      },
    });

    return this.login(user);
  }
}

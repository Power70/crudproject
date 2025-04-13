import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { hash } from 'crypto';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(
    Strategy,
    'jwt',
) {
  constructor(
    config: ConfigService,
    private prisma: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_SECRET')!,
    });
  }

  // Implement required validate() method
  async validate(payload: {
    sub: number; 
    email: string 
  }) {
    const user = 
    await this.prisma.user.findUnique({
        where: {
            id: payload.sub,
        },
    });
   if (!user) return null;

   const {hash, ...userWithoutHash} = user;
   return userWithoutHash
  }
}

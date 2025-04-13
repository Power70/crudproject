import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { promises } from 'dns';


@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  async signup(dto: AuthDto) {
    // Generate the password hash
    const hash = await argon.hash(dto.password);

    try {
      // save the new user in the db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
        // select the field you want to return
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });
      // Return the save sign token

      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
        hash: true,
      },
    });

    if (!user) {
      throw new ForbiddenException('Invalid email address');
    }

    const isMatch = await argon.verify(user.hash, dto.password);
    if (!isMatch) {
      throw new ForbiddenException('Invalid password');
    }

    const { hash, ...userWithoutHash } = user;
    // return the jwt token
    return this.signToken(user.id, user.email);
  }

// Since we are not going to return the user
// but the token from jwt we create a special function that will handle that
  async signToken(
    userId: number,
    email: string
  ): Promise<{access_token: string}> {
    const payload = {
      sub: userId, 
      email
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    return{
      access_token: token
    };
  }
}

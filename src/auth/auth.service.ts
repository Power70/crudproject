import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';


@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

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
      // Return the save user

      return user;
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
    return userWithoutHash;
  }
}

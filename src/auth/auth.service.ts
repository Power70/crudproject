import { Delete, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
// This allow us to handle or write our business logic
// inject in into other files e.g controllers
@Injectable()
export class AuthService {
    // in auth service we can use dependency injection to get reference in our auth service from our prisma service to our prisma service in the prisma module
    constructor(private prisma: PrismaService){} //this is the dependency injection
  async signup(dto: AuthDto) {
    // generate the hash password
    const hash = await argon.hash(dto.password);

    // save the new user in the db
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        hash
      },
      // select the field to reture
      select:{
        id: true,
        email: true,
        createdAt: true
      },
    });

     //to delete just the hash password from the returned data
    return user;
    
  }

  signin() {
    return { message: 'I have sign in Yeaaaaaah' };
  }
}

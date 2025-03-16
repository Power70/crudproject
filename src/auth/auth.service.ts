import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// This allow us to handle or write our business logic
// inject in into other files e.g controllers
@Injectable()
export class AuthService {
    // in auth service we can use dependency injection to get reference in our auth service from our prisma service to our prisma service in the prisma module
    constructor(private prisma: PrismaService){} //this is the dependency injection
  signup() {
    return { message: 'I have sign up' };
  }

  signin() {
    return { message: 'I have sign in Yeaaaaaah' };
  }
}

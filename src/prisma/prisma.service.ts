import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// here we create logic that connect with the database

@Injectable()
export class PrismaService extends PrismaClient {
  // prisma client is a constructor that allow us
  // to connect to the database, it has connect and disconnect
  constructor() {
    super({
      datasources: {
        db: {
          url: 'postgresql://postgres:123@localhost:5434/nest?schema=public',
        },
      },
    });
  }
}

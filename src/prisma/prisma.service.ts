import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

// here we create logic that connect with the database

@Injectable()
export class PrismaService extends PrismaClient {
  // prisma client is a constructor that allow us
  // to connect to the database, it has connect and disconnect
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          // use the config service here on the url
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }
  cleanDb() {
    return this.$transaction([
      this.bookmark.deleteMany(),
      this.user.deleteMany(),
    ]);
  }   
}



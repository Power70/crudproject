import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // The config module load the .env fie into our application
    ConfigModule.forRoot({
      // make the config module available in all other modules
      isGlobal: true
    }),
    AuthModule, 
    UserModule, 
    BookmarkModule, 
    PrismaModule
  ],
})
export class AppModule {}

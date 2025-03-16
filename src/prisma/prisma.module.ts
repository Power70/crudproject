import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// @Global make the prisma module available to all other module that neeeds to connect the database
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule {}

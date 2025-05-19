import { DatabaseModule } from '@/database/database.module';
import { UtilsModule } from '@/utils/utils.module';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [DatabaseModule, UtilsModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}

import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    TaskModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

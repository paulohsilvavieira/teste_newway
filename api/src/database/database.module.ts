import { Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { TaskEntity, UserEntity } from './entities';
import { TaskRepository } from './repositories/task.repository';

const providers: Provider[] = [UserRepository, TaskRepository];

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const typeOrmConfig: TypeOrmModuleOptions = {
          type: 'postgres',
          username: configService.get('PG_USERNAME'),
          password: configService.get('PG_PASSWORD'),
          database: configService.get('PG_DATABASE'),
          host: configService.get('PG_HOST'),
          port: configService.get('PG_PORT'),
          entities: [__dirname + '/entities/index{.ts,.js}'],
          synchronize: false,
          logging: true,
        };

        return typeOrmConfig;
      },
    }),
    TypeOrmModule.forFeature([UserEntity, TaskEntity]),
  ],
  providers,
  exports: providers,
})
export class DatabaseModule {}

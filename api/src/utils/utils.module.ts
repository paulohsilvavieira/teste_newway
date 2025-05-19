import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './services/token.service';
import { BcryptService } from './services/bcrypt.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get('SECRET_JWT'),
          signOptions: { expiresIn: '24h' },
        };
      },
    }),
  ],
  providers: [TokenService, BcryptService],
  exports: [TokenService, BcryptService],
})
export class UtilsModule {}

/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { UserRepository } from '@/database/repositories/user.repository';
import { TokenService } from '@/utils/services/token.service';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class UserJwtAuthGuard implements CanActivate {
  constructor(
    @Inject(TokenService) private readonly tokenService: TokenService,
    @Inject(UserRepository) private readonly userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException();
    }

    const [, token] = authHeader.split(' ');

    if (!token) {
      throw new UnauthorizedException();
    }

    const { isValid, payload } = await this.tokenService.verifyToken(token);

    if (isValid) {
      const user = await this.userRepository.getUserByEmail(payload.email);
      request.body = {
        ...request.body,
        user: {
          role: payload.role,
          id: user.id,
          email: payload.email,
        },
      };
      return true;
    }
    return false;
  }
}

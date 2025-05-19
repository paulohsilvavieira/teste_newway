/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(@Inject(JwtService) private jwtService: JwtService) {}

  createToken(payload: any) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async verifyToken(
    token: string,
  ): Promise<{ isValid: boolean; payload: any; error?: any }> {
    try {
      const payload = await this.jwtService.verifyAsync(token);

      return {
        isValid: true,
        payload,
      };
    } catch (error) {
      return {
        isValid: false,
        payload: undefined,
        error,
      };
    }
  }
}

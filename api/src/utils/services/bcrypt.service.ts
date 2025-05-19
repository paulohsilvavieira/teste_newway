import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcryptjs';

@Injectable()
export class BcryptService {
  private readonly salt: number = 10;
  async encrypt(plaintext: string): Promise<{ hashText: string }> {
    const hashText = await bcrypt.hash(plaintext, this.salt);
    return {
      hashText,
    };
  }

  async verifyHash(
    plaintext: string,
    digest: string,
  ): Promise<{ isValid: boolean }> {
    return {
      isValid: await bcrypt.compare(plaintext, digest),
    };
  }
}

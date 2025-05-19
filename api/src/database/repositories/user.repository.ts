import { UserEntity } from '../entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../utils/user.role';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userTypeOrmRepository: Repository<UserEntity>,
  ) {}
  async getUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userTypeOrmRepository.findOne({
      where: {
        email,
      },
      select: {
        id: true,
        password: true,
        role: true,
        name: true,
      },
    });
    return user;
  }

  async getCountAdmins(): Promise<number> {
    const adminLength = await this.userTypeOrmRepository.count({
      where: {
        role: UserRole.ADMIN,
      },
    });
    return adminLength;
  }
  async getExpirationTimeTokenResetPassword(
    email: string,
  ): Promise<{ expirationTimeTokenRecover: number }> {
    const { expirationTimeTokenRecover } =
      await this.userTypeOrmRepository.findOne({
        where: {
          email,
        },
        select: {
          expirationTimeTokenRecover: true,
        },
      });
    return {
      expirationTimeTokenRecover,
    };
  }

  async invalidTokenExpiration(email: string): Promise<void> {
    await this.userTypeOrmRepository.update(
      {
        email,
      },
      {
        tokenRecoverPassword: null,
        expirationTimeTokenRecover: -10000,
      },
    );
  }

  async getPasswordToCompre(email: string): Promise<{ password: string }> {
    const result = await this.userTypeOrmRepository.findOne({
      where: { email },
      select: {
        password: true,
      },
    });
    return {
      password: result ? result.password : null,
    };
  }

  async getUUIDAndRole(email: string): Promise<{ authorizationId: string }> {
    const result = await this.userTypeOrmRepository.findOne({
      where: { email },
      select: { uuid: true, role: true },
    });
    return {
      authorizationId: result ? result.uuid : null,
    };
  }

  async createUser(params: {
    email: string;
    name: string;
    password: string;
    role: UserRole;
  }): Promise<void> {
    await this.userTypeOrmRepository.insert(params);
  }

  async updatePasswordAuth(params: {
    email: string;
    password: string;
  }): Promise<void> {
    await this.userTypeOrmRepository.update(
      { email: params.email },
      {
        password: params.password,
      },
    );
  }

  async saveTokenRecoverPassword(params: {
    tokenRecoverPassword: string;
    expirationTimeTokenRecover: number;
    email: string;
  }): Promise<void> {
    await this.userTypeOrmRepository.update(
      { email: params.email },
      {
        tokenRecoverPassword: params.tokenRecoverPassword,
        expirationTimeTokenRecover: params.expirationTimeTokenRecover,
      },
    );
  }
}

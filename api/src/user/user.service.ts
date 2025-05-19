import { UserRepository } from '@/database/repositories/user.repository';
import { UserRole } from '@/database/utils/user.role';
import { BcryptService } from '@/utils/services/bcrypt.service';
import { TokenService } from '@/utils/services/token.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: TokenService,
    private readonly bcryptService: BcryptService,
  ) {}

  async register(params: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
  }) {
    const { hashText } = await this.bcryptService.encrypt(params.password);

    await this.userRepository.createUser({
      ...params,
      password: hashText,
    });
  }

  async registerFirstAdmin(params: {
    email: string;
    password: string;
    name: string;
  }) {
    const admins = await this.userRepository.getCountAdmins();
    if (admins > 0) throw new BadRequestException('Primeiro Admin Já criado');

    const { hashText } = await this.bcryptService.encrypt(params.password);

    await this.userRepository.createUser({
      ...params,
      role: UserRole.ADMIN,
      password: hashText,
    });
  }

  async registerCommonUser(params: {
    email: string;
    password: string;
    name: string;
  }) {
    const user = await this.userRepository.getUserByEmail(params.email);
    if (user) {
      throw new BadRequestException('Usuario já cadastrado');
    }
    const { hashText } = await this.bcryptService.encrypt(params.password);

    await this.userRepository.createUser({
      ...params,
      password: hashText,
      role: UserRole.USER,
    });
    return {
      token: this.jwtService.createToken({
        email: params.email,
        role: UserRole.USER,
      }),
    };
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }

    const { isValid } = await this.bcryptService.verifyHash(
      password,
      user.password,
    );
    if (!isValid) {
      throw new UnauthorizedException();
    }
    const token = this.jwtService.createToken({
      email,
      role: user.role,
      name: user.name,
    });
    return {
      token,
    };
  }
}

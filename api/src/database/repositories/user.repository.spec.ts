import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { makeFakeDb } from '@/test/utils/mocks/database';
import { TaskEntity, UserEntity } from '../entities';
import { UserRepository } from './user.repository';
import { IBackup } from 'pg-mem';
import { UserRole } from '../utils/user.role';
import { randomUUID } from 'node:crypto';

describe('UserRepository', () => {
  let sut: UserRepository;
  let connectionFake: DataSource;
  let backup: IBackup;

  const mockUser = {
    email: 'john@example.com',
    name: 'John Doe',
    password: 'hashed-password',
    role: UserRole.USER,
    uuid: randomUUID(),
  };

  beforeAll(async () => {
    const { db, connection } = await makeFakeDb([UserEntity, TaskEntity]);
    connectionFake = connection;
    backup = db.backup();

    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(),
        TypeOrmModule.forFeature([UserEntity, TaskEntity]),
      ],
      providers: [UserRepository],
    })
      .overrideProvider(DataSource)
      .useValue(connectionFake)
      .compile();

    sut = moduleRef.get(UserRepository);
  });

  beforeEach(() => {
    backup.restore();
  });

  afterAll(async () => {
    await connectionFake.destroy();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      await sut.createUser(mockUser);
      const user = await connectionFake
        .getRepository(UserEntity)
        .findOneBy({ email: mockUser.email });
      expect(user).toBeDefined();
      expect(user?.email).toBe(mockUser.email);
    });
  });

  describe('getUserByEmail', () => {
    it('should return user with selected fields', async () => {
      await sut.createUser(mockUser);
      const user = await sut.getUserByEmail(mockUser.email);
      expect(user).toMatchObject({
        name: mockUser.name,
        password: mockUser.password,
        role: mockUser.role,
      });
    });
  });

  describe('getPasswordToCompre', () => {
    it('should return password only', async () => {
      await sut.createUser(mockUser);
      const result = await sut.getPasswordToCompre(mockUser.email);
      expect(result.password).toBe(mockUser.password);
    });
  });

  describe('getUUIDAndRole', () => {
    it('should return uuid of the user', async () => {
      await sut.createUser(mockUser);
      const result = await sut.getUUIDAndRole(mockUser.email);
      expect(result.authorizationId).toBe(mockUser.uuid);
    });
  });

  describe('saveTokenRecoverPassword & getExpirationTimeTokenResetPassword', () => {
    it('should save and retrieve recovery token expiration', async () => {
      await sut.createUser(mockUser);
      const timestamp = Date.now() + 3600000;

      await sut.saveTokenRecoverPassword({
        email: mockUser.email,
        tokenRecoverPassword: 'recovery-token',
        expirationTimeTokenRecover: timestamp,
      });

      const result = await sut.getExpirationTimeTokenResetPassword(
        mockUser.email,
      );
      expect(result.expirationTimeTokenRecover).toBe(timestamp);
    });
  });

  describe('invalidTokenExpiration', () => {
    it('should invalidate recovery token', async () => {
      await sut.createUser(mockUser);

      await sut.saveTokenRecoverPassword({
        email: mockUser.email,
        tokenRecoverPassword: 'recovery-token',
        expirationTimeTokenRecover: Date.now() + 50000,
      });

      await sut.invalidTokenExpiration(mockUser.email);

      const user = await connectionFake
        .getRepository(UserEntity)
        .findOneBy({ email: mockUser.email });
      expect(user.tokenRecoverPassword).toBeUndefined();
      expect(user.expirationTimeTokenRecover).toBe(-10000);
    });
  });

  describe('updatePassword', () => {
    it('should update the user password', async () => {
      await sut.createUser(mockUser);

      await sut.updatePasswordAuth({
        email: mockUser.email,
        password: 'new-password',
      });

      const user = await connectionFake.getRepository(UserEntity).findOne({
        where: {
          email: mockUser.email,
        },
        select: {
          password: true,
        },
      });
      expect(user?.password).toBe('new-password');
    });
  });
});

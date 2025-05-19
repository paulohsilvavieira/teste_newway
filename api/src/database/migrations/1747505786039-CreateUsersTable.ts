import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1747505786039 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    await queryRunner.query(
      `CREATE TYPE IF NOT EXISTS "user_role_enum" AS ENUM ('user', 'admin')`,
    );
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'uuid',
            type: 'uuid',
            isNullable: false,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: false,
            isUnique: false,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
            isUnique: false,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'tokenRecoverPassword',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'expirationTimeTokenRecover',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'lastAccessAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'role',
            type: '"user_role_enum"',
            default: `'user'`,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users', true, true, true);
  }
}

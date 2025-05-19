import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { randomUUID } from 'crypto';
import { DataType, IMemoryDb, newDb } from 'pg-mem';
import { DataSource } from 'typeorm';

export const makeFakeDb = async (
  entities: EntityClassOrSchema[],
): Promise<{ db: IMemoryDb; connection: DataSource }> => {
  const db = newDb();

  db.public.registerFunction({
    implementation: () => 'test',
    name: 'current_database',
  });

  db.registerExtension('uuid-ossp', (schema) => {
    schema.registerFunction({
      name: 'uuid_generate_v4',
      returns: DataType.uuid,
      implementation: randomUUID,
      impure: true,
    });
  });

  db.public.registerFunction({
    implementation: () => 'test',
    name: 'version',
  });

  const databaseConnection: DataSource =
    (await db.adapters.createTypeormDataSource({
      type: 'postgres',
      entities: entities,
      logging: false,
      migrations: ['./src/database/migrations/*.ts'],
    })) as DataSource;

  await databaseConnection.initialize();
  await databaseConnection.synchronize();

  return { db, connection: databaseConnection };
};

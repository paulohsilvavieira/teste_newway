import { Client } from 'pg';
import { config } from 'dotenv';
config();

const databaseName = process.env.PG_DATABASE;
const user = process.env.PG_USERNAME;
const password = process.env.PG_PASSWORD;
const host = process.env.PG_HOST;
const port = Number(process.env.PG_PORT ?? '5432');

async function createDatabase() {
  const client = new Client({
    user,
    password,
    host,
    port,
    database: 'postgres',
  });

  try {
    await client.connect();
    const result = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = '${databaseName}'`,
    );
    if (result.rowCount === 0) {
      await client.query(`CREATE DATABASE "${databaseName}"`);
      console.log(`Banco de dados "${databaseName}" criado com sucesso!`);
    } else {
      console.log(`Banco de dados "${databaseName}" já existe.`);
    }
  } catch (error) {
    console.error('Erro ao criar o banco de dados:', error);
  } finally {
    await client.end();
  }
}

void createDatabase();

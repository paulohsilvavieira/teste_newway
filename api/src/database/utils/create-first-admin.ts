import { Client } from 'pg';
import { config } from 'dotenv';
import * as bcrypt from 'bcryptjs';

config();

const databaseName = process.env.PG_DATABASE;
const user = process.env.PG_USERNAME;
const password = process.env.PG_PASSWORD;
const host = process.env.PG_HOST;
const port = Number(process.env.PG_PORT ?? '5432');

async function createAdminUser() {
  const client = new Client({
    user,
    password,
    host,
    port,
    database: databaseName,
  });

  const adminEmail = 'admin@admin.com';
  const adminPassword = '123456'; // Altere se quiser
  const adminName = 'Admin';
  const adminRole = 'admin';

  try {
    await client.connect();

    const existingUser = await client.query(
      `SELECT 1 FROM users WHERE email = $1`,
      [adminEmail],
    );

    if (existingUser.rowCount > 0) {
      console.log('Usuário admin já existe.');
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await client.query(
      `
      INSERT INTO users (email, name, password, role)
      VALUES ($1, $2, $3, $4)
    `,
      [adminEmail, adminName, hashedPassword, adminRole],
    );

    console.log('Usuário admin criado com sucesso!');
  } catch (error) {
    console.error('Erro ao criar usuário admin:', error);
  } finally {
    await client.end();
  }
}

void createAdminUser();

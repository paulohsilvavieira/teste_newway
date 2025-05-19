import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const { setupSagger } = await import('./swagger');

  const app = await NestFactory.create(AppModule);
  app.enableCors();

  setupSagger(app);
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();

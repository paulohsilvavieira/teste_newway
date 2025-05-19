import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
async function bootstrap() {
  const { setupSagger } = await import('./swagger');

  const app = await NestFactory.create(AppModule);
  app.enableCors({
     origin: process.env.ORIGIN_CORS,
  });
  app.use(helmet);
  setupSagger(app);
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();

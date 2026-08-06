import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.WEB_APP_URL ?? 'http://localhost:3000',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api/v1', { exclude: ['health'] });

  const port = process.env.PORT ?? 3333;
  await app.listen(port);
  Logger.log(`TrendHub ISP AI API listening on port ${port}`, 'Bootstrap');
}
bootstrap().catch((error: unknown) => {
  Logger.error(
    'Failed to start TrendHub ISP AI API',
    error instanceof Error ? error.stack : String(error),
    'Bootstrap',
  );
  process.exit(1);
});

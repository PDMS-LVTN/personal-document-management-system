import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Personal Document Management System')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('Note')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger_api', app, document);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  await app.listen(8080);
}
bootstrap();

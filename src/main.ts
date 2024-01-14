import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import configuration from './configs/configuration';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('E-Learning')
    .setDescription('E learning API description')
    .setVersion('1.0')
    .addTag('E-Learning')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const port = configuration().port;
  await app.listen(port);
}
bootstrap();

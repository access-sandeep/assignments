import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import bandOptons from './bands/settings';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle(bandOptons.title)
    .setDescription(bandOptons.description)
    .setVersion(bandOptons.version)
    .addTag(bandOptons.tag)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(bandOptons.url, app, document);

  await app.listen(bandOptons.port);
  console.info(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

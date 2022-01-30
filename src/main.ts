import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
} from '@nestjs/swagger';

const customOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
  customSiteTitle: 'ACL Service',
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const config = new DocumentBuilder()
    .setTitle('ACL service')
    .setDescription(
      'ACL microservice that can be consumed as a third-party and integrated into your application, to manage your users, their roles and, their previleges.',
    )
    .setVersion('1.0')
    .addTag('ACL')
    .addBearerAuth({ in: 'header', type: 'http' }, 'Authorization')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document, customOptions);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`running on port ${port}`);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './config';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  /*
  |--------------------------------------------------------------------------
  | Checks for JWT SECRET, required for app bootstrapping
  |--------------------------------------------------------------------------
  */
  // if (!process.env.JWT_SECRET) {
  //   throw new Error('Fatal Error. JWT_SECRET variable is not provided');
  // }

  /*
  |--------------------------------------------------------------------------
  | Creates an instance of the NestApplication and set Middlewares
  |--------------------------------------------------------------------------
  */
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  //   app.use(helmet.default());
  //   app.use(rateLimit(config.rateLimit));

  /*
  |--------------------------------------------------------------------------
  | Set global filters and pipes
  |--------------------------------------------------------------------------
  */
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalFilters(new BadRequestExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );

  /*
    |--------------------------------------------------------------------------
    | Initialize Swagger and APP
    |--------------------------------------------------------------------------
    */
  //   if (process.env.NODE_ENV !== 'production') {
  //     await bootstrapSwagger(app, config.app);
  //   }
  await app.listen(config.app.port);
}
bootstrap();

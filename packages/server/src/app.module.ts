import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './module/user/user.module';

import { config } from './config';

const userEntity = config.dbEntity.User;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'conoblog',
      entities: [userEntity],
      synchronize: true,
    }),
    UserModule,
  ],
})
export class AppModule {}

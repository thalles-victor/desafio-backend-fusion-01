import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './Application/Entities/User.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: Number(process.env.POSTGRES_PORT),
      database: process.env.POSTGRES_ENGLISH_DB,
      username: process.env.POSTGRES_ENGLISH_USER,
      password: process.env.POSTGRES_ENGLISH_PASSWORD,
      url: process.env.POSTGRES_DATABASE_URL,
      synchronize: process.env.STAGE.toUpperCase() === 'DEV' ? true : false,
      entities: [UserEntity],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

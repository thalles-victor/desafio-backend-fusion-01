import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from 'src/Application/Entities/Session.entity';
import { UserEntity } from 'src/Application/Entities/User.entity';
import { UserTypOrmRepository } from './User/UserTypeOrm.repository';
import { SessionTypeOrmRepository } from './Session/SessionTypeOrm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, SessionEntity])],
  providers: [UserTypOrmRepository, SessionTypeOrmRepository],
  exports: [TypeOrmModule],
})
export class RepositoriesModule {}

import { Module } from '@nestjs/common';
import { AuthService } from './Auth.service';
import { AuthController } from './Auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { RepoReferenceInjection } from '@metadata';
import { UserTypOrmRepository } from 'src/Infra/Repositories/User/UserTypeOrm.repository';
import { SessionTypeOrmRepository } from 'src/Infra/Repositories/Session/SessionTypeOrm.repository';
import { RepositoriesModule } from 'src/Infra/Repositories/Repositories.module';
import { JwtAuthGuard } from './Guards/JwtAuth.guard';

@Module({
  imports: [
    RepositoriesModule,
    JwtModule.register({
      secret: 'SECRET',
      global: true,
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: RepoReferenceInjection.USER_REPOSITORY,
      useClass: UserTypOrmRepository,
    },
    {
      provide: RepoReferenceInjection.SESSION_REPOSITORY,
      useClass: SessionTypeOrmRepository,
    },
    AuthService,
    JwtAuthGuard,
  ],
})
export class AuthModule {}

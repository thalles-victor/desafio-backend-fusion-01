import { Module } from '@nestjs/common';
import { AuthService } from './Auth.service';
import { AuthController } from './Auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { RepoReferenceInjection } from '@metadata';
import { RepositoriesModule } from 'src/Infra/Repositories/Repositories.module';
import { JwtAuthGuard } from './Guards/JwtAuth.guard';
import { SessionInMemoryRepository } from 'src/Infra/Repositories/Session/SessionImMemory.repository';
import { UserInMemoryRepository } from 'src/Infra/Repositories/User/UserInMemory.repository';

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
      useClass: UserInMemoryRepository,
    },
    {
      provide: RepoReferenceInjection.SESSION_REPOSITORY,
      useClass: SessionInMemoryRepository,
    },
    AuthService,
    JwtAuthGuard,
  ],
})
export class AuthModule {}

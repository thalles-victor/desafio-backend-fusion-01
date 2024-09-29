import { RepoReferenceInjection } from '@metadata';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { generateUUID } from '@utils';
import { UserEntity } from 'src/Application/Entities/User.entity';
import { ISessionRepositoryContract } from 'src/Infra/Repositories/Session/ISession.respository-contract';
import { IUserRepositoryContract } from 'src/Infra/Repositories/User/IUser-repository-contract';
import { SessionEntity } from 'src/Application/Entities/Session.entity';
import { SignUpDto } from './dtos/SignUp.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(RepoReferenceInjection.USER_REPOSITORY)
    private readonly userRepository: IUserRepositoryContract,
    @Inject(RepoReferenceInjection.SESSION_REPOSITORY)
    private readonly sessionRepository: ISessionRepositoryContract,
  ) {}

  async signUp(signUpDto: SignUpDto, userAgent: string) {
    const emailInUsed = await this.userRepository.getBy({
      email: signUpDto.email,
    });

    if (emailInUsed) {
      throw new UnauthorizedException();
    }

    const user = Object.assign(new UserEntity(), {
      id: generateUUID(),
      name: signUpDto.name,
      email: signUpDto.email,
      password: await bcrypt.hash(signUpDto.password, await bcrypt.genSalt()),
      created_at: new Date(),
      updated_at: new Date(),
      avatar_url: null,
    } as UserEntity);

    const session = Object.assign(new SessionEntity(), {
      id: generateUUID(),
      user: user,
      user_id: user.id,
      device: userAgent,
      created_at: new Date(),
    } as SessionEntity);

    const userCreated = await this.userRepository.create(user);
    await this.sessionRepository.create(session);

    return userCreated;
  }
}

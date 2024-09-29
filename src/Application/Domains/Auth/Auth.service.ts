import { RepoReferenceInjection } from '@metadata';
import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { generateUUID } from '@utils';
import { UserEntity } from 'src/Application/Entities/User.entity';
import { ISessionRepositoryContract } from 'src/Infra/Repositories/Session/ISession.respository-contract';
import { IUserRepositoryContract } from 'src/Infra/Repositories/User/IUser-repository-contract';
import { SessionEntity } from 'src/Application/Entities/Session.entity';
import { SignUpDto } from './dtos/SignUp.dto';
import { JwtPayloadType } from '@types';
import { SignInDto } from './dtos/SignIn.dto';

type ClientInfo = {
  device: string;
  ip_address: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(RepoReferenceInjection.USER_REPOSITORY)
    private readonly userRepository: IUserRepositoryContract,
    @Inject(RepoReferenceInjection.SESSION_REPOSITORY)
    private readonly sessionRepository: ISessionRepositoryContract,
  ) {}

  async signUp(signUpDto: SignUpDto, clientInfo: ClientInfo) {
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
      device: clientInfo.device,
      ip_address: clientInfo.ip_address,
      created_at: new Date(),
    } as SessionEntity);

    const userCreated = await this.userRepository.create(user);
    const sessionCreated = await this.sessionRepository.create(session);

    const token = await this.createJwtSession({ session_id: session.id });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = userCreated;

    return {
      user: rest,
      session: {
        session_id: sessionCreated.id,
        device: sessionCreated.device,
        created_at: sessionCreated.created_at,
      },
      access_token: token,
    };
  }

  async signIn(signInDto: SignInDto, clientInfo: ClientInfo) {
    const userExist = await this.userRepository.getBy({
      email: signInDto.email,
    });

    if (!userExist) {
      throw new UnauthorizedException();
    }

    const passwordMatch = await bcrypt.compare(
      signInDto.password,
      userExist.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = userExist;

    const session = Object.assign(new SessionEntity(), {
      id: generateUUID(),
      user: userExist,
      user_id: userExist.id,
      created_at: new Date(),
      device: clientInfo.device,
      ip_address: clientInfo.ip_address,
    } as SessionEntity);

    const sessionCreated = await this.sessionRepository.create(session);

    const token = await this.createJwtSession({
      session_id: sessionCreated.id,
    });

    return {
      user: rest,
      session: {
        session_id: sessionCreated.id,
        device: sessionCreated.device,
        created_at: sessionCreated.created_at,
      },
      access_token: token,
    };
  }

  async getUserInformation(session_id: string) {
    const session = await this.sessionRepository.getBy({ id: session_id });

    const user = await this.userRepository.getBy({ id: session.user_id });

    if (!session) {
      throw new NotFoundException('session not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;

    return {
      user: rest,
      session: {
        session_id: session.id,
        device: session.device,
        created_at: session.created_at,
      },
    };
  }

  private async createJwtSession(payload: JwtPayloadType) {
    return this.jwtService.sign(payload);
  }
}

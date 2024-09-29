import { RepoReferenceInjection } from '@metadata';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadType } from '@types';
import { Request } from 'express';
import { ISessionRepositoryContract } from 'src/Infra/Repositories/Session/ISession.respository-contract';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(RepoReferenceInjection.SESSION_REPOSITORY)
    private readonly sessionRepository: ISessionRepositoryContract,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = (await this.jwtService.verifyAsync(
        token,
      )) as JwtPayloadType;

      const session = await this.sessionRepository.getBy({
        id: payload.session_id,
      });

      if (!session) {
        throw new UnauthorizedException('session not found');
      }

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request) {
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('require Bearer token');
    }

    const [type, token] = authorization.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}

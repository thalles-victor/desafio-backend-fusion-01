import {
  SessionEntity,
  SessionUniqueParam,
} from 'src/Application/Entities/Session.entity';
import { SessionUpdateEntity } from 'src/Application/Entities/Update/Session.entity-update';
import { ISessionRepositoryContract } from './ISession.respository-contract';
import { InternalServerErrorException } from '@nestjs/common';
import { splitKeyAndValue } from '@validators';

export class SessionInMemoryRepository implements ISessionRepositoryContract {
  private sessions: SessionEntity[] = [];

  async create(entity: SessionEntity): Promise<SessionEntity> {
    try {
      this.sessions.push(entity);
      return Promise.resolve(entity);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async update(
    param: SessionUniqueParam,
    updateEntity: SessionUpdateEntity,
  ): Promise<SessionEntity> {
    try {
      const [key, value] = splitKeyAndValue(param);
      const sessionToUpdate = this.sessions.find(
        (session) => session[key] === value,
      );

      if (!sessionToUpdate) {
        throw new Error('Session not found');
      }

      Object.assign(sessionToUpdate, {
        ...updateEntity,
      });

      return Promise.resolve(sessionToUpdate);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async delete(param: SessionUniqueParam): Promise<void> {
    try {
      const [key, value] = splitKeyAndValue(param);
      this.sessions = this.sessions.filter((session) => session[key] !== value);
      return Promise.resolve();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getBy(param: SessionUniqueParam): Promise<SessionEntity> {
    try {
      const [key, value] = splitKeyAndValue(param);
      const session = this.sessions.find((session) => session[key] === value);
      return Promise.resolve(session);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getMany(): Promise<SessionEntity[]> {
    try {
      return Promise.resolve(this.sessions);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}

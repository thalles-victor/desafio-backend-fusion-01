import {
  SessionEntity,
  SessionUniqueParam,
} from 'src/Application/Entities/Session.entity';
import { SessionUpdateEntity } from 'src/Application/Entities/Update/Session.entity-update';
import { ISessionRepositoryContract } from './ISession.respository-contract';
import { InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { splitKeyAndValue } from '@validators';

export class SessionTypeOrmRepository implements ISessionRepositoryContract {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
  ) {}

  async create(entity: SessionEntity): Promise<SessionEntity> {
    try {
      const session = this.sessionRepository.create(entity);

      return this.sessionRepository.save(session);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async update(
    param: SessionUniqueParam,
    updateEntity: SessionUpdateEntity,
  ): Promise<SessionEntity> {
    try {
      const [key, value] = splitKeyAndValue(param);

      const sessionToUpdate = await this.sessionRepository.findOneBy({
        [key]: value,
      });

      const newSession = Object.assign(sessionToUpdate, {
        ...updateEntity,
      } as SessionUpdateEntity);

      return this.sessionRepository.save(newSession);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async delete(param: SessionUniqueParam): Promise<void> {
    const [key, value] = splitKeyAndValue(param);

    try {
      await this.sessionRepository.delete({ [key]: value });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getBy(param: SessionUniqueParam): Promise<SessionEntity> {
    const [key, value] = splitKeyAndValue(param);

    try {
      return this.sessionRepository.findOneBy({ [key]: value });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getMany(): Promise<SessionEntity[]> {
    try {
      const sessions = await this.sessionRepository.find();

      return sessions;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}

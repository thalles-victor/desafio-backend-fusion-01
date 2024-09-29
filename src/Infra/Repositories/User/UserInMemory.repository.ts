import {
  UserEntity,
  UserUniqueParam,
} from 'src/Application/Entities/User.entity';
import { UserUpdateEntity } from 'src/Application/Entities/Update/User.update-update';
import { IUserRepositoryContract } from './IUser-repository-contract';
import { InternalServerErrorException } from '@nestjs/common';
import { splitKeyAndValue } from '@validators';

export class UserInMemoryRepository implements IUserRepositoryContract {
  private users: UserEntity[] = [];

  create(entity: UserEntity): Promise<UserEntity> {
    try {
      this.users.push(entity);
      return Promise.resolve(entity);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async update(
    param: UserUniqueParam,
    updateEntity: UserUpdateEntity,
  ): Promise<UserEntity> {
    try {
      const [key, value] = splitKeyAndValue(param);
      const userToUpdate = this.users.find((user) => user[key] === value);

      if (!userToUpdate) {
        throw new Error('User not found');
      }

      Object.assign(userToUpdate, {
        name: updateEntity.name,
        avatar_url: updateEntity.avatar_url,
        password: updateEntity.password,
      });

      return Promise.resolve(userToUpdate);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async delete(param: UserUniqueParam): Promise<void> {
    try {
      const [key, value] = splitKeyAndValue(param);
      this.users = this.users.filter((user) => user[key] !== value);
      return Promise.resolve();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getBy(param: UserUniqueParam): Promise<UserEntity> {
    try {
      const [key, value] = splitKeyAndValue(param);
      const user = this.users.find((user) => user[key] === value);
      return Promise.resolve(user);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getMany(): Promise<UserEntity[]> {
    try {
      return Promise.resolve(this.users);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}

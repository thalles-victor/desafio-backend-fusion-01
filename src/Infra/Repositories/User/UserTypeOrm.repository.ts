import { UserUpdateEntity } from 'src/Application/Entities/Update/User.update-update';
import {
  UserEntity,
  UserUniqueParam,
} from 'src/Application/Entities/User.entity';
import { IUserRepositoryContract } from './IUser-repository-contract';
import { InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { splitKeyAndValue } from '@validators';

export class UserTypOrmRepository implements IUserRepositoryContract {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userTypeOrmRepository: Repository<UserEntity>,
  ) {}

  create(entity: UserEntity): Promise<UserEntity> {
    try {
      const user = this.userTypeOrmRepository.create(entity);

      return this.userTypeOrmRepository.save(user);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async update(
    param: UserUniqueParam,
    updateEntity: UserUpdateEntity,
  ): Promise<UserEntity> {
    try {
      const [key, value] = splitKeyAndValue(param);

      const userToUpdate = await this.userTypeOrmRepository.findOneBy({
        [key]: value,
      });

      const updateUserAssigned = Object.assign(userToUpdate, {
        name: updateEntity.name,
        avatar_url: updateEntity.avatar_url,
        password: updateEntity.password,
      } as UserUpdateEntity);

      return this.userTypeOrmRepository.save(updateUserAssigned);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async delete(param: UserUniqueParam): Promise<void> {
    const [key, value] = splitKeyAndValue(param);

    try {
      await this.userTypeOrmRepository.delete({ [key]: value });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getBy(param: UserUniqueParam): Promise<UserEntity> {
    const [key, value] = splitKeyAndValue(param);

    try {
      const user = await this.userTypeOrmRepository.findOneBy({ [key]: value });

      return user;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getMany(): Promise<UserEntity[]> {
    try {
      const users = await this.userTypeOrmRepository.find();

      return users;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}

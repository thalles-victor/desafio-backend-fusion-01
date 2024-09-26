import {
  UserEntity,
  UserUniqueParam,
} from 'src/Application/Entities/User.entity';
import { IBaseRepositoriesContract } from '../IBase.repositories-contract';
import { UserUpdateEntity } from 'src/Application/Entities/Update/User.update-update';

export interface IUserRepositoryContract
  extends IBaseRepositoriesContract<
    UserEntity,
    UserUpdateEntity,
    UserUniqueParam
  > {}

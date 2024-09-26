import {
  SessionEntity,
  SessionUniqueParam,
} from 'src/Application/Entities/Session.entity';
import { IBaseRepositoriesContract } from '../IBase.repositories-contract';
import { SessionUpdateEntity } from 'src/Application/Entities/Update/Session.entity-update';

export interface ISessionRepositoryContract
  extends IBaseRepositoriesContract<
    SessionEntity,
    SessionUpdateEntity,
    SessionUniqueParam
  > {}

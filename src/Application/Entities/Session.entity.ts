import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { UserEntity } from './User.entity';

export type SessionUniqueParam = { id: string };

@Entity('sessions')
export class SessionEntity {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.sessions)
  @JoinColumn()
  user: UserEntity;

  @Column('uuid')
  @Index()
  user_id: string;
}

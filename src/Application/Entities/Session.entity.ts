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

  @Column({ type: 'varchar' })
  device: string;

  @Column({ type: 'varchar' })
  ip_address: string;

  @Column({ type: 'timestamptz', default: new Date() })
  created_at: Date;
}

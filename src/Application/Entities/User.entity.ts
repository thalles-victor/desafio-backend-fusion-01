import { Session } from 'inspector/promises';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { SessionEntity } from './Session.entity';

export type UserUniqueParam = { id: string } | { email: string };

@Entity('users')
export class UserEntity {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  avatar_url?: string;

  @Column({ type: 'timestamptz' })
  created_at: Date;

  @Column({ type: 'timestamptz' })
  updated_at: Date;

  @OneToMany(() => SessionEntity, (session) => session.user)
  sessions: Session[];
}

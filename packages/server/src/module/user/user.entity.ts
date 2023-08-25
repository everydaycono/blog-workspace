import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  //   @Exclude()
  @Column({ length: 500 })
  password: string;

  @Column({ length: 500, default: null })
  avatar: string; // avatar

  @Column({ length: 500, nullable: null })
  email: string; // email

  @Column('simple-enum', { enum: ['admin', 'visitor'], default: 'visitor' })
  role: string; // user role

  @Column('simple-enum', { enum: ['locked', 'active'], default: 'active' })
  status: string; // status

  @Column({ default: 'normal' })
  type: string; // 用户类型

  @CreateDateColumn({
    type: 'datetime',
    comment: 'Creation time',
    name: 'create_at',
  })
  createAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
    comment: 'Update time',
    name: 'update_at',
  })
  updateAt: Date;
}

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Project } from '../../projects/entities/project.entity';
import { Interest } from '../../interests/entities/interest.entity';
import { Investment } from '../../investments/entities/investment.entity';

export enum UserRole {
  ENTREPRENEUR = 'entrepreneur',
  INVESTOR = 'investor',
  ADMIN = 'admin'
}

@Entity()
export class User {  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;  @Column({ default: UserRole.ENTREPRENEUR })
  role: UserRole;

  @OneToMany(() => Project, project => project.owner)
  projects: Project[];

  @OneToMany(() => Investment, investment => investment.investor)
  investments: Investment[];

  @ManyToMany(() => Interest, interest => interest.users)
  @JoinTable({
    name: 'user_interests',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'interest_id', referencedColumnName: 'id' }
  })
  interests: Interest[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
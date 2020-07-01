// ANCHOR Typeorm
import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToMany,
} from 'typeorm';

// ANCHOR Entities
import { TimestampedEntity } from './common/TimestampedEntity';
import { Student } from './Student';
import { StudentState } from './StudentState';

// ANCHOR Payloads
import { ESex } from '../payloads/user';

/* ANCHOR: User entity ------------------------------------------------------ */
@Entity()
export class User extends TimestampedEntity {
  /* ANCHOR: Fields --------------------------------------------------------- */
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  @Index()
  public email!: string;

  @Column()
  public firstName!: string;

  @Column({ nullable: true })
  public middleName?: string;

  @Column()
  public lastName!: string;

  @Column()
  public streetAddress!: string;

  @Column()
  public barangay!: string;

  @Column()
  public city!: string;

  @Column({ enum: ESex })
  public sex!: ESex;

  @Column()
  public birthDate!: Date;

  @Column({ nullable: true })
  public phoneNumber?: string;

  @Column({ nullable: true })
  public displayPhotoUuid?: string;

  @Column({ default: false })
  @Index()
  public isAdmin!: boolean;

  /* ANCHOR: Relations ------------------------------------------------------ */
  @OneToOne(() => Student, (student) => student.user)
  public student!: Student;

  @ManyToMany(() => StudentState, (state) => state.users)
  public states!: StudentState;
}

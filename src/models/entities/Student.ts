import {
  Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToMany, OneToMany,
} from 'typeorm';
import { Candidate } from './Candidate';
// ANCHOR Typeorm

// ANCHOR Entities
import { User } from './User';
import { Section } from './Section';
import { TimestampedEntity } from './common/TimestampedEntity';

/* ANCHOR: Student entity --------------------------------------------------- */
@Entity()
export class Student extends TimestampedEntity {
  /* ANCHOR: Fields --------------------------------------------------------- */
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ unique: true })
  public learnerReferenceNumber!: string;

  @Column({ nullable: true })
  public currentGradeLevel?: string;

  @Column({ nullable: true })
  public currentSection?: string;

  @Column({ nullable: true })
  public currentAdviser?: string;

  /* ANCHOR: Relations ------------------------------------------------------ */
  @OneToOne(() => User, (user) => user.student, {
    eager: true,
  })
  public user!: User;

  @ManyToMany(() => Section, (section) => section.students)
  public sections!: Section[];

  @OneToMany(() => Candidate, (candidate) => candidate.student)
  public candidates!: Candidate[];

  // TODO STUDENT ENTITY
  // Add proper types to section and grade level
  // Add relations
  // Add load functions for "current*" fields
}

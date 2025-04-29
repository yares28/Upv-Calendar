import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from 'typeorm';
import { ExamSchedule } from './ExamSchedule';

@Entity({ name: 'subjects' })
@Unique(['code', 'name'])
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  acronym: string;

  @OneToMany(() => ExamSchedule, examSchedule => examSchedule.subject)
  examSchedules: ExamSchedule[];
} 
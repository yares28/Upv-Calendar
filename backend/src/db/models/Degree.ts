import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ExamSchedule } from './ExamSchedule';

@Entity({ name: 'degrees' })
export class Degree {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @OneToMany(() => ExamSchedule, examSchedule => examSchedule.degree)
  examSchedules: ExamSchedule[];
} 
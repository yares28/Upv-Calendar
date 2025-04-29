import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ExamSchedule } from './ExamSchedule';

@Entity({ name: 'places' })
export class Place {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => ExamSchedule, examSchedule => examSchedule.place)
  examSchedules: ExamSchedule[];
} 
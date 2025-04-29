import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Subject } from './Subject';
import { Degree } from './Degree';
import { Place } from './Place';

@Entity({ name: 'exam_schedule' })
@Unique(['date', 'startTime', 'subjectId', 'degreeId'])
export class ExamSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ name: 'start_time', type: 'time' })
  startTime: string;

  @Column({ name: 'end_time', type: 'time' })
  endTime: string;

  @Column({ name: 'duration_minutes', default: 90 })
  durationMinutes: number;

  @Column({ name: 'subject_id' })
  subjectId: number;

  @ManyToOne(() => Subject, subject => subject.examSchedules)
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @Column({ name: 'degree_id' })
  degreeId: number;

  @ManyToOne(() => Degree, degree => degree.examSchedules)
  @JoinColumn({ name: 'degree_id' })
  degree: Degree;

  @Column()
  year: number;

  @Column()
  semester: string;

  @Column({ name: 'place_id', nullable: true })
  placeId: number;

  @ManyToOne(() => Place, place => place.examSchedules, { nullable: true })
  @JoinColumn({ name: 'place_id' })
  place: Place;

  @Column({ nullable: true })
  professor: string;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
} 
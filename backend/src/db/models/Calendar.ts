import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

export interface CalendarFilters {
  degrees?: string[];
  semesters?: number[];
  subjects?: string[];
}

@Entity({ name: 'calendars' })
export class Calendar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, user => user.calendars)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'jsonb', default: '{}' })
  filters: CalendarFilters;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
} 
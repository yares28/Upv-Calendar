import { Between, FindOptionsWhere, Repository } from 'typeorm';
import { AppDataSource } from '../db/config';
import { Exam, ExamSchedule, Degree, Subject, Place } from '../db/models';

export class ExamService {
  private examRepository: Repository<Exam>;
  private examScheduleRepository: Repository<ExamSchedule>;
  private degreeRepository: Repository<Degree>;
  private subjectRepository: Repository<Subject>;
  private placeRepository: Repository<Place>;

  constructor() {
    this.examRepository = AppDataSource.getRepository(Exam);
    this.examScheduleRepository = AppDataSource.getRepository(ExamSchedule);
    this.degreeRepository = AppDataSource.getRepository(Degree);
    this.subjectRepository = AppDataSource.getRepository(Subject);
    this.placeRepository = AppDataSource.getRepository(Place);
  }

  /**
   * Get all exams with optional filters
   */
  async getExams(filters?: {
    degree?: string;
    semester?: number;
    subject?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Exam[]> {
    const where: FindOptionsWhere<Exam> = {};

    if (filters) {
      if (filters.degree) {
        where.degree = filters.degree;
      }
      
      if (filters.semester) {
        where.semester = filters.semester;
      }
      
      if (filters.subject) {
        where.subject = filters.subject;
      }
      
      if (filters.startDate || filters.endDate) {
        where.date = {};
        
        if (filters.startDate) {
          where.date = { ...where.date, gte: filters.startDate };
        }
        
        if (filters.endDate) {
          where.date = { ...where.date, lte: filters.endDate };
        }
      }
    }

    return this.examRepository.find({
      where,
      order: { date: 'ASC', startTime: 'ASC' }
    });
  }

  /**
   * Get exam by ID
   */
  async getExamById(id: number): Promise<Exam | null> {
    return this.examRepository.findOneBy({ id });
  }

  /**
   * Create a new exam
   */
  async createExam(examData: Partial<Exam>): Promise<Exam> {
    const exam = this.examRepository.create(examData);
    return this.examRepository.save(exam);
  }

  /**
   * Update an exam
   */
  async updateExam(id: number, examData: Partial<Exam>): Promise<Exam | null> {
    const result = await this.examRepository.update(id, examData);
    
    if (result.affected === 0) {
      return null;
    }
    
    return this.getExamById(id);
  }

  /**
   * Delete an exam
   */
  async deleteExam(id: number): Promise<boolean> {
    const result = await this.examRepository.delete(id);
    return result.affected !== 0;
  }

  /**
   * Get unique filter options (degrees, semesters, subjects)
   */
  async getFilterOptions(): Promise<{
    degrees: string[];
    semesters: number[];
    subjects: string[];
  }> {
    const degrees = await this.examRepository
      .createQueryBuilder()
      .select('DISTINCT degree')
      .orderBy('degree')
      .getRawMany();
    
    const semesters = await this.examRepository
      .createQueryBuilder()
      .select('DISTINCT semester')
      .orderBy('semester')
      .getRawMany();
    
    const subjects = await this.examRepository
      .createQueryBuilder()
      .select('DISTINCT subject')
      .orderBy('subject')
      .getRawMany();
    
    return {
      degrees: degrees.map(d => d.degree),
      semesters: semesters.map(s => s.semester),
      subjects: subjects.map(s => s.subject)
    };
  }
} 
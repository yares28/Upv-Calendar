import { AppDataSource, initializeDB } from '../db/config';
import { Exam, Degree, Subject } from '../db/models';

describe('Database Connectivity and Data Tests', () => {
  beforeAll(async () => {
    await initializeDB();
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  test('should connect to database', () => {
    expect(AppDataSource.isInitialized).toBe(true);
  });

  test('should find seeded degrees', async () => {
    const degreeRepository = AppDataSource.getRepository(Degree);
    const degrees = await degreeRepository.find();
    
    expect(degrees.length).toBeGreaterThan(0);
    expect(degrees.some(d => d.code === 'GIINF')).toBe(true);
  });

  test('should find seeded subjects', async () => {
    const subjectRepository = AppDataSource.getRepository(Subject);
    const subjects = await subjectRepository.find();
    
    expect(subjects.length).toBeGreaterThan(0);
    expect(subjects.some(s => s.acronym === 'PROG')).toBe(true);
  });

  test('should find seeded exams', async () => {
    const examRepository = AppDataSource.getRepository(Exam);
    const exams = await examRepository.find();
    
    expect(exams.length).toBeGreaterThan(0);
    expect(exams.some(e => e.subject === 'Matemáticas I')).toBe(true);
  });
}); 
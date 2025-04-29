import jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { AppDataSource } from '../db/config';
import { User, Calendar, CalendarFilters } from '../db/models';

export class AuthService {
  private userRepository: Repository<User>;
  private calendarRepository: Repository<Calendar>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.calendarRepository = AppDataSource.getRepository(Calendar);
  }

  /**
   * Register a new user
   */
  async registerUser(userData: {
    name: string,
    email: string,
    password: string
  }): Promise<User> {
    const { name, email, password } = userData;

    // Check if user exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user
    const user = this.userRepository.create({
      name,
      email,
      password
    });

    // Hash password before saving
    user.password = await user.hashPassword(password);

    // Save user
    return this.userRepository.save(user);
  }

  /**
   * Authenticate a user
   */
  async loginUser(email: string, password: string): Promise<{ user: User, token: string }> {
    // Find user by email
    const user = await this.userRepository.findOne({ 
      where: { email },
      relations: ['calendars']
    });

    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user.id);

    return { user, token };
  }

  /**
   * Get user by ID
   */
  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ 
      where: { id },
      relations: ['calendars'],
      select: { password: false }
    });
  }

  /**
   * Save calendar for user
   */
  async saveCalendar(
    userId: number,
    name: string,
    description: string | undefined,
    filters: CalendarFilters
  ): Promise<Calendar> {
    // Check if user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new Error('User not found');
    }

    // Create calendar
    const calendar = this.calendarRepository.create({
      userId,
      name,
      description,
      filters
    });

    return this.calendarRepository.save(calendar);
  }

  /**
   * Delete calendar
   */
  async deleteCalendar(userId: number, calendarId: number): Promise<boolean> {
    const result = await this.calendarRepository.delete({
      id: calendarId,
      userId
    });
    
    return result.affected !== 0;
  }

  /**
   * Get user calendars
   */
  async getUserCalendars(userId: number): Promise<Calendar[]> {
    return this.calendarRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  /**
   * Generate JWT token
   */
  private generateToken(userId: number): string {
    const secret = process.env.JWT_SECRET || 'defaultsecret';
    const expiresIn = process.env.JWT_EXPIRES_IN || '30d';
    
    return jwt.sign({ id: userId }, secret, { expiresIn });
  }
} 
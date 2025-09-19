import User, { IUser } from '../models/User';
import { CustomError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export class AuthService {
  static async registerUser(userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<IUser> {
    const { name, email, password, role } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new CustomError('User already exists', 400);
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user'
    });

    logger.info('User registered successfully', { userId: user._id, email });
    return user;
  }

  static async loginUser(email: string, password: string): Promise<IUser> {
    // Check for demo admin credentials first
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@goalinstitute.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (email === adminEmail && password === adminPassword) {
      // Check if admin user exists, if not create one
      let adminUser = await User.findOne({ email: adminEmail });
      if (!adminUser) {
        adminUser = await User.create({
          name: 'Admin User',
          email: adminEmail,
          password: adminPassword,
          role: 'admin',
          isActive: true
        });
        logger.info('Admin user created', { userId: adminUser._id, email: adminEmail });
      }
      
      logger.info('Admin logged in successfully', { userId: adminUser._id, email: adminEmail });
      return adminUser;
    }

    // Check for regular user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new CustomError('Invalid credentials', 401);
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new CustomError('Invalid credentials', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new CustomError('Account is deactivated', 401);
    }

    logger.info('User logged in successfully', { userId: user._id, email });
    return user;
  }

  static async getUserById(userId: string): Promise<IUser | null> {
    return await User.findById(userId);
  }

  static async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true
    });
  }

  static async deactivateUser(userId: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(userId, { isActive: false }, { new: true });
  }
} 
/**
 * T067: Unit Tests for Authentication Service
 *
 * Tests for user registration and authentication functions.
 */

// Mock database BEFORE importing modules that depend on it
jest.mock('@/lib/database', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
  },
}));

import { registerUser, authenticateUser, getUserById, getUserByEmail } from '@/lib/auth';
import { db } from '@/lib/database';

describe('Authentication Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should create a new user with hashed password', async () => {
      const mockInsert = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([{ id: 'user-123' }]),
      };

      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]), // No existing user
      };

      (db.select as jest.Mock).mockReturnValue(mockSelect);
      (db.insert as jest.Mock).mockReturnValue(mockInsert);

      const result = await registerUser('test@example.com', 'password123');

      expect(result).toEqual({ userId: 'user-123' });
      expect(mockInsert.values).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
          passwordHash: expect.any(String),
        })
      );
    });

    it('should reject invalid email format', async () => {
      await expect(registerUser('invalid-email', 'password123')).rejects.toThrow(
        'Invalid email format'
      );
    });

    it('should reject short passwords', async () => {
      await expect(registerUser('test@example.com', 'short')).rejects.toThrow('Password too short');
    });

    it('should reject duplicate emails', async () => {
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([{ id: 'existing-user' }]), // Existing user
      };

      (db.select as jest.Mock).mockReturnValue(mockSelect);

      await expect(registerUser('existing@example.com', 'password123')).rejects.toThrow(
        'Email already registered'
      );
    });
  });

  describe('authenticateUser', () => {
    it('should return user data for valid credentials', async () => {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('password123', 10);

      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([
          {
            id: 'user-123',
            email: 'test@example.com',
            passwordHash: hashedPassword,
          },
        ]),
      };

      (db.select as jest.Mock).mockReturnValue(mockSelect);

      const result = await authenticateUser('test@example.com', 'password123');

      expect(result).toEqual({
        userId: 'user-123',
        email: 'test@example.com',
      });
    });

    it('should return null for non-existent user', async () => {
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]), // No user found
      };

      (db.select as jest.Mock).mockReturnValue(mockSelect);

      const result = await authenticateUser('nonexistent@example.com', 'password123');

      expect(result).toBeNull();
    });

    it('should return null for invalid password', async () => {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('correct-password', 10);

      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([
          {
            id: 'user-123',
            email: 'test@example.com',
            passwordHash: hashedPassword,
          },
        ]),
      };

      (db.select as jest.Mock).mockReturnValue(mockSelect);

      const result = await authenticateUser('test@example.com', 'wrong-password');

      expect(result).toBeNull();
    });
  });

  describe('getUserById', () => {
    it('should return user data without password hash', async () => {
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([
          {
            id: 'user-123',
            email: 'test@example.com',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]),
      };

      (db.select as jest.Mock).mockReturnValue(mockSelect);

      const result = await getUserById('user-123');

      expect(result).toMatchObject({
        id: 'user-123',
        email: 'test@example.com',
      });
      expect(result).not.toHaveProperty('passwordHash');
    });

    it('should return null for non-existent user', async () => {
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      };

      (db.select as jest.Mock).mockReturnValue(mockSelect);

      const result = await getUserById('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('getUserByEmail', () => {
    it('should return user data for existing email', async () => {
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([
          {
            id: 'user-123',
            email: 'test@example.com',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]),
      };

      (db.select as jest.Mock).mockReturnValue(mockSelect);

      const result = await getUserByEmail('test@example.com');

      expect(result).toMatchObject({
        id: 'user-123',
        email: 'test@example.com',
      });
    });

    it('should return null for non-existent email', async () => {
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      };

      (db.select as jest.Mock).mockReturnValue(mockSelect);

      const result = await getUserByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });
});

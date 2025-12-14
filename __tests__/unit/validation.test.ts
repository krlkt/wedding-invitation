/**
 * T066: Unit Tests for Validation Schemas
 *
 * Tests for input validation utilities.
 */

import {
  validateEmail,
  validatePassword,
  validateUrl,
  validateInstagramLink,
  validateSubdomain,
  validateFileUpload,
  validateRequired,
  validateDate,
} from '@/lib/validation';

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('should accept valid email addresses', () => {
      expect(validateEmail('test@example.com')).toEqual({ valid: true });
      expect(validateEmail('user.name+tag@example.co.uk')).toEqual({ valid: true });
      expect(validateEmail('test123@test-domain.com')).toEqual({ valid: true });
    });

    it('should reject invalid email formats', () => {
      expect(validateEmail('')).toMatchObject({ valid: false });
      expect(validateEmail('invalid')).toMatchObject({ valid: false });
      expect(validateEmail('test@')).toMatchObject({ valid: false });
      expect(validateEmail('@example.com')).toMatchObject({ valid: false });
      expect(validateEmail('test@example')).toMatchObject({ valid: false });
    });
  });

  describe('validatePassword', () => {
    it('should accept passwords with 8+ characters', () => {
      expect(validatePassword('password123')).toEqual({ valid: true });
      expect(validatePassword('12345678')).toEqual({ valid: true });
      expect(validatePassword('very-long-password-with-many-characters')).toEqual({ valid: true });
    });

    it('should reject short passwords', () => {
      expect(validatePassword('')).toMatchObject({ valid: false });
      expect(validatePassword('short')).toMatchObject({ valid: false });
      expect(validatePassword('1234567')).toMatchObject({ valid: false });
    });
  });

  describe('validateUrl', () => {
    it('should accept valid URLs', () => {
      expect(validateUrl('https://example.com')).toEqual({ valid: true });
      expect(validateUrl('http://test.co.uk/path')).toEqual({ valid: true });
      expect(validateUrl('https://subdomain.example.com:8080/path?query=value')).toEqual({
        valid: true,
      });
    });

    it('should reject invalid URLs', () => {
      expect(validateUrl('')).toMatchObject({ valid: false });
      expect(validateUrl('not-a-url')).toMatchObject({ valid: false });
      expect(validateUrl('example.com')).toMatchObject({ valid: false });
    });
  });

  describe('validateInstagramLink', () => {
    it('should accept valid Instagram URLs', () => {
      expect(validateInstagramLink('https://instagram.com/username')).toEqual({ valid: true });
      expect(validateInstagramLink('http://www.instagram.com/username')).toEqual({ valid: true });
      expect(validateInstagramLink('https://www.instagram.com/p/post-id/')).toEqual({
        valid: true,
      });
    });

    it('should accept empty string (optional field)', () => {
      expect(validateInstagramLink('')).toEqual({ valid: true });
    });

    it('should reject non-Instagram URLs', () => {
      expect(validateInstagramLink('https://facebook.com/page')).toMatchObject({ valid: false });
      expect(validateInstagramLink('https://example.com')).toMatchObject({ valid: false });
    });
  });

  describe('validateSubdomain', () => {
    it('should accept valid subdomains', () => {
      expect(validateSubdomain('wedding')).toEqual({ valid: true });
      expect(validateSubdomain('john-and-jane')).toEqual({ valid: true });
      expect(validateSubdomain('test123')).toEqual({ valid: true });
      expect(validateSubdomain('a')).toEqual({ valid: true });
    });

    it('should reject invalid subdomains', () => {
      expect(validateSubdomain('')).toMatchObject({ valid: false });
      expect(validateSubdomain('-starts-with-hyphen')).toMatchObject({ valid: false });
      expect(validateSubdomain('ends-with-hyphen-')).toMatchObject({ valid: false });
      expect(validateSubdomain('has_underscore')).toMatchObject({ valid: false });
      expect(validateSubdomain('HAS-UPPERCASE')).toMatchObject({ valid: false });
      expect(validateSubdomain('a'.repeat(64))).toMatchObject({ valid: false }); // Too long
    });
  });

  describe('validateFileUpload', () => {
    function createMockFile(name: string, size: number, type: string): File {
      const blob = new Blob(['a'.repeat(size)], { type });
      return new File([blob], name, { type });
    }

    it('should accept valid image files within size limit', () => {
      const jpegFile = createMockFile('test.jpg', 1024 * 1024, 'image/jpeg');
      const pngFile = createMockFile('test.png', 2 * 1024 * 1024, 'image/png');
      const webpFile = createMockFile('test.webp', 1024, 'image/webp');

      expect(validateFileUpload(jpegFile)).toEqual({ valid: true });
      expect(validateFileUpload(pngFile)).toEqual({ valid: true });
      expect(validateFileUpload(webpFile)).toEqual({ valid: true });
    });

    it('should reject files exceeding size limit', () => {
      const largeFile = createMockFile('large.jpg', 5 * 1024 * 1024, 'image/jpeg');
      expect(validateFileUpload(largeFile)).toMatchObject({ valid: false });
    });

    it('should reject invalid file types', () => {
      const textFile = createMockFile('document.txt', 1024, 'text/plain');
      const pdfFile = createMockFile('document.pdf', 1024, 'application/pdf');

      expect(validateFileUpload(textFile)).toMatchObject({ valid: false });
      expect(validateFileUpload(pdfFile)).toMatchObject({ valid: false });
    });

    it('should respect custom size and type options', () => {
      const file = createMockFile('test.jpg', 1024, 'image/jpeg');

      const smallLimit = validateFileUpload(file, { maxSize: 512 });
      expect(smallLimit).toMatchObject({ valid: false });

      const customTypes = validateFileUpload(file, { allowedMimeTypes: ['image/png'] });
      expect(customTypes).toMatchObject({ valid: false });
    });
  });

  describe('validateRequired', () => {
    it('should accept non-empty values', () => {
      expect(validateRequired('value', 'Field')).toEqual({ valid: true });
      expect(validateRequired(123, 'Field')).toEqual({ valid: true });
      expect(validateRequired(true, 'Field')).toEqual({ valid: true });
    });

    it('should reject empty values', () => {
      expect(validateRequired('', 'Field')).toMatchObject({ valid: false });
      expect(validateRequired('   ', 'Field')).toMatchObject({ valid: false });
      expect(validateRequired(null, 'Field')).toMatchObject({ valid: false });
      expect(validateRequired(undefined, 'Field')).toMatchObject({ valid: false });
    });
  });

  describe('validateDate', () => {
    it('should accept valid date strings', () => {
      expect(validateDate('2024-01-15')).toEqual({ valid: true });
      expect(validateDate('2024-12-31T23:59:59.000Z')).toEqual({ valid: true });
      expect(validateDate('December 25, 2024')).toEqual({ valid: true });
    });

    it('should reject invalid date strings', () => {
      expect(validateDate('')).toMatchObject({ valid: false });
      expect(validateDate('not-a-date')).toMatchObject({ valid: false });
      expect(validateDate('2024-13-01')).toMatchObject({ valid: false }); // Invalid month
      expect(validateDate('2024-02-30')).toMatchObject({ valid: false }); // Invalid day
    });
  });
});

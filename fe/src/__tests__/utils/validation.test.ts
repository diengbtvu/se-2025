import { validateEmail, validatePhone, validatePassword, validateUserName } from '@/utils/validation'

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.uk')).toBe(true)
      expect(validateEmail('test+tag@example.org')).toBe(true)
    })

    it('should reject invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('test@.com')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })

  describe('validatePhone', () => {
    it('should validate correct Vietnamese phone numbers', () => {
      expect(validatePhone('0987654321')).toBe(true)
      expect(validatePhone('+84987654321')).toBe(true)
      expect(validatePhone('0387654321')).toBe(true)
      expect(validatePhone('0587654321')).toBe(true)
      expect(validatePhone('0787654321')).toBe(true)
      expect(validatePhone('0887654321')).toBe(true)
      expect(validatePhone('0987654321')).toBe(true)
    })

    it('should reject invalid phone numbers', () => {
      expect(validatePhone('123')).toBe(false)
      expect(validatePhone('098765432')).toBe(false) // too short
      expect(validatePhone('09876543212')).toBe(false) // too long
      expect(validatePhone('1234567890')).toBe(false) // wrong prefix
      expect(validatePhone('')).toBe(false)
    })
  })

  describe('validatePassword', () => {
    it('should validate correct password formats', () => {
      expect(validatePassword('password123')).toBe(true)
      expect(validatePassword('MyPass123')).toBe(true)
      expect(validatePassword('123abc')).toBe(true)
    })

    it('should reject invalid password formats', () => {
      expect(validatePassword('123')).toBe(false) // too short
      expect(validatePassword('password')).toBe(false) // no number
      expect(validatePassword('123456')).toBe(false) // no letter
      expect(validatePassword('')).toBe(false)
    })

    it('should reject passwords that are too long', () => {
      const longPassword = 'a'.repeat(51)
      expect(validatePassword(longPassword)).toBe(false)
    })
  })

  describe('validateUserName', () => {
    it('should validate correct username formats', () => {
      expect(validateUserName('testuser')).toBe(true)
      expect(validateUserName('user123')).toBe(true)
      expect(validateUserName('test_user')).toBe(true)
      expect(validateUserName('user')).toBe(true) // minimum length
    })

    it('should reject invalid username formats', () => {
      expect(validateUserName('te')).toBe(false) // too short
      expect(validateUserName('test@user')).toBe(false) // invalid character
      expect(validateUserName('test user')).toBe(false) // space not allowed
      expect(validateUserName('')).toBe(false)
    })

    it('should reject usernames that are too long', () => {
      const longUsername = 'a'.repeat(21)
      expect(validateUserName(longUsername)).toBe(false)
    })
  })
}) 
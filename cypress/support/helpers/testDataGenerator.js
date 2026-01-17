/**
 * Test Data Generators
 * Utilities for generating test data
 */

class TestDataGenerator {
  /**
   * Generate a random email address
   * @param {string} domain - Email domain (default: example.com)
   * @returns {string} Random email address
   */
  static generateEmail(domain = 'example.com') {
    const randomString = Math.random().toString(36).substring(2, 10)
    const timestamp = Date.now()
    return `test_${randomString}_${timestamp}@${domain}`
  }

  /**
   * Generate a random username
   * @param {number} length - Length of username (default: 8)
   * @returns {string} Random username
   */
  static generateUsername(length = 8) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let username = 'user_'
    for (let i = 0; i < length; i++) {
      username += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return username
  }

  /**
   * Generate a random password
   * @param {number} length - Password length (default: 12)
   * @param {boolean} includeSpecial - Include special characters
   * @returns {string} Random password
   */
  static generatePassword(length = 12, includeSpecial = true) {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numbers = '0123456789'
    const special = '!@#$%^&*'

    let chars = lowercase + uppercase + numbers
    if (includeSpecial) {
      chars += special
    }

    let password = ''
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  /**
   * Generate a random phone number
   * @param {string} format - Phone format (default: US)
   * @returns {string} Random phone number
   */
  static generatePhoneNumber(format = 'US') {
    if (format === 'US') {
      const area = Math.floor(Math.random() * 900) + 100
      const prefix = Math.floor(Math.random() * 900) + 100
      const line = Math.floor(Math.random() * 9000) + 1000
      return `(${area}) ${prefix}-${line}`
    }
    return `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`
  }

  /**
   * Generate a random user object
   * @returns {object} User object with random data
   */
  static generateUser() {
    return {
      firstName: this.generateName(),
      lastName: this.generateName(),
      email: this.generateEmail(),
      username: this.generateUsername(),
      password: this.generatePassword(),
      phone: this.generatePhoneNumber(),
      age: Math.floor(Math.random() * 50) + 18,
      createdAt: new Date().toISOString()
    }
  }

  /**
   * Generate a random name
   * @returns {string} Random name
   */
  static generateName() {
    const names = [
      'John',
      'Jane',
      'Bob',
      'Alice',
      'Charlie',
      'Diana',
      'Emma',
      'Frank',
      'Grace',
      'Henry',
      'Ivy',
      'Jack'
    ]
    return names[Math.floor(Math.random() * names.length)]
  }

  /**
   * Generate random address
   * @returns {object} Address object
   */
  static generateAddress() {
    return {
      street: `${Math.floor(Math.random() * 9999) + 1} Main St`,
      city: this.generateName() + ' City',
      state: ['CA', 'NY', 'TX', 'FL'][Math.floor(Math.random() * 4)],
      zipCode: String(Math.floor(Math.random() * 90000) + 10000),
      country: 'USA'
    }
  }

  /**
   * Generate random date within range
   * @param {Date} start - Start date
   * @param {Date} end - End date
   * @returns {Date} Random date
   */
  static generateDateBetween(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  }

  /**
   * Generate random array of items
   * @param {Function} generator - Generator function
   * @param {number} count - Number of items
   * @returns {Array} Array of generated items
   */
  static generateArray(generator, count = 5) {
    return Array.from({ length: count }, () => generator())
  }
}

export default TestDataGenerator

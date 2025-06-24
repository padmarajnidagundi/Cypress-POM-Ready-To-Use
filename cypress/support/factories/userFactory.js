const { faker } = require('@faker-js/faker')

const UserTypes = {
  ADMIN: 'admin',
  REGULAR: 'regular',
  GUEST: 'guest'
}

const UserDefaults = {
  [UserTypes.ADMIN]: {
    role: 'admin',
    permissions: ['read', 'write', 'delete']
  },
  [UserTypes.REGULAR]: {
    role: 'user',
    permissions: ['read', 'write']
  },
  [UserTypes.GUEST]: {
    role: 'guest',
    permissions: ['read']
  }
}

class UserFactory {
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  static generate(overrides = {}, userType = UserTypes.REGULAR) {
    const baseUser = {
      id: faker.string.uuid(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      createdAt: faker.date.recent(),
      ...UserDefaults[userType]
    }

    const user = { ...baseUser, ...overrides }

    // Validate email
    if (!this.validateEmail(user.email)) {
      throw new Error('Invalid email format')
    }

    return user
  }

  static generateMany(count, overrides = {}, userType = UserTypes.REGULAR) {
    if (count < 1) throw new Error('Count must be greater than 0')
    return Array.from({ length: count }, () => this.generate(overrides, userType))
  }

  // Convenience methods for specific user types
  static generateAdmin(overrides = {}) {
    return this.generate(overrides, UserTypes.ADMIN)
  }

  static generateGuest(overrides = {}) {
    return this.generate(overrides, UserTypes.GUEST)
  }
}

module.exports = { UserFactory, UserTypes }

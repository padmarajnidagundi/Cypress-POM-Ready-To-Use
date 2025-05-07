const { faker } = require('@faker-js/faker')

class UserFactory {
  static generate(overrides = {}) {
    return {
      id: faker.string.uuid(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      ...overrides
    }
  }

  static generateMany(count, overrides = {}) {
    return Array.from({ length: count }, () => this.generate(overrides))
  }
}

export default UserFactory

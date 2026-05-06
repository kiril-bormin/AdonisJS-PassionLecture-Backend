import factory from '@adonisjs/lucid/factories'
import User from '#models/user'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      pseudo: faker.internet.username(),
      email: faker.internet.email(),
      password: 'password123',
      role: 'user' as const,
    }
  })
  .build()

import factory from '@adonisjs/lucid/factories'
import Author from '#models/author'

export const AuthorFactory = factory
  .define(Author, async ({ faker }) => {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    }
  })
  .build()

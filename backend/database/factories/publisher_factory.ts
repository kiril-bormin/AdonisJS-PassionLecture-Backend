import factory from '@adonisjs/lucid/factories'
import Publisher from '#models/publisher'

export const PublisherFactory = factory
  .define(Publisher, async ({ faker }) => {
    return {
      name: faker.company.name(),
    }
  })
  .build()

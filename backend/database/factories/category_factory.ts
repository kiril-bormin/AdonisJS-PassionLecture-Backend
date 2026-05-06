import factory from '@adonisjs/lucid/factories'
import Category from '#models/category'

export const CategoryFactory = factory
  .define(Category, async ({ faker }) => {
    return {
      label: faker.lorem.word(),
    }
  })
  .build()

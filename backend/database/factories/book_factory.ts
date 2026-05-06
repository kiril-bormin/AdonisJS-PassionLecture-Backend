import factory from '@adonisjs/lucid/factories'
import Book from '#models/book'
import { AuthorFactory } from './author_factory.js'
import { CategoryFactory } from './category_factory.js'
import { PublisherFactory } from './publisher_factory.js'
import { UserFactory } from './user_factory.js'

export const BookFactory = factory
  .define(Book, async ({ faker }) => {
    return {
      title: faker.lorem.sentence(3),
      summary: faker.lorem.paragraph(),
      pagesCount: faker.number.int({ min: 50, max: 1000 }),
      editionYear: faker.number.int({ min: 1900, max: 2024 }),
      extractUrl: faker.internet.url(),
      coverUrl: faker.image.urlLoremFlickr({ category: 'books' }),
    }
  })
  .relation('author', () => AuthorFactory)
  .relation('category', () => CategoryFactory)
  .relation('publisher', () => PublisherFactory)
  .relation('user', () => UserFactory)
  .build()

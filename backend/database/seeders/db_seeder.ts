import { AuthorFactory } from '#database/factories/author_factory'
import { CategoryFactory } from '#database/factories/category_factory'
import { PublisherFactory } from '#database/factories/publisher_factory'
import { UserFactory } from '#database/factories/user_factory'
import Book from '#models/book'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const admin = await UserFactory.merge({
      role: 'admin',
      pseudo: 'admin',
      email: 'admin@test.com',
    }).create()

    const users = await UserFactory.createMany(5)
    const allUsers = [admin, ...users]

    const createdByUserId = admin.id

    const authors = await AuthorFactory.merge({ createdByUserId }).createMany(10)
    const categories = await CategoryFactory.merge({ createdByUserId }).createMany(5)
    const publishers = await PublisherFactory.merge({ createdByUserId }).createMany(5)

    const books = Array.from({ length: 30 }, (_, index) => {
      const user = allUsers[Math.floor(Math.random() * allUsers.length)]
      const author = authors[Math.floor(Math.random() * authors.length)]
      const category = categories[Math.floor(Math.random() * categories.length)]
      const publisher = publishers[Math.floor(Math.random() * publishers.length)]

      return {
        title: `Book ${index + 1}`,
        summary: `Summary for book ${index + 1}`,
        pagesCount: Math.floor(Math.random() * 950) + 50,
        editionYear: 1900 + Math.floor(Math.random() * 125),
        extractUrl: `https://example.com/books/${index + 1}/extract`,
        coverUrl: `https://picsum.photos/seed/book-${index + 1}/600/900`,
        userId: user.id,
        authorId: author.id,
        categoryId: category.id,
        publisherId: publisher.id,
      }
    })

    await Book.createMany(books)
  }
}

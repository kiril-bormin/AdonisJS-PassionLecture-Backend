import { AuthorFactory } from '#database/factories/author_factory'
import { BookFactory } from '#database/factories/book_factory'
import { CategoryFactory } from '#database/factories/category_factory'
import { PublisherFactory } from '#database/factories/publisher_factory'
import { UserFactory } from '#database/factories/user_factory'
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

    const authors = await AuthorFactory.createMany(10)
    const categories = await CategoryFactory.createMany(5)
    const publishers = await PublisherFactory.createMany(5)

    for (let i = 0; i < 30; i++) {
      const user = allUsers[Math.floor(Math.random() * allUsers.length)]
      const author = authors[Math.floor(Math.random() * authors.length)]
      const category = categories[Math.floor(Math.random() * categories.length)]
      const publisher = publishers[Math.floor(Math.random() * publishers.length)]

      await BookFactory.merge({
        userId: user.id,
        authorId: author.id,
        categoryId: category.id,
        publisherId: publisher.id,
      }).create()
    }
  }
}

import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Review from './review.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Book from './book.js'
import Author from './author.js'
import Category from './category.js'
import Publisher from './publisher.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare pseudo: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare role: 'user' | 'admin'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => Review, {
    foreignKey: 'userId',
  })
  declare reviews: HasMany<typeof Review>

  @hasMany(() => Book, {
    foreignKey: 'userId',
  })
  declare books: HasMany<typeof Book>

  @hasMany(() => Author, {
    foreignKey: 'createdByUserId',
  })
  declare createdAuthors: HasMany<typeof Author>

  @hasMany(() => Category, {
    foreignKey: 'createdByUserId',
  })
  declare createdCategories: HasMany<typeof Category>

  @hasMany(() => Publisher, {
    foreignKey: 'createdByUserId',
  })
  declare createdPublishers: HasMany<typeof Publisher>

  static accessTokens = DbAccessTokensProvider.forModel(User)
}

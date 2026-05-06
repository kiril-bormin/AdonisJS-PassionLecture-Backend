import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Book from './book.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Author extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare firstname: string

  @column()
  declare lastname: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Book, {
    foreignKey: 'author_id',
  })
  declare books: HasMany<typeof Book>
}

import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Book from './book.js'
import User from './user.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class Publisher extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column({ columnName: 'created_by_user_id' })
  declare createdByUserId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Book, {
    foreignKey: 'publisherId',
  })
  declare books: HasMany<typeof Book>

  @belongsTo(() => User, {
    foreignKey: 'createdByUserId',
  })
  declare createdByUser: BelongsTo<typeof User>
}

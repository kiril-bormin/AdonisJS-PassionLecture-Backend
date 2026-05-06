import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reviews'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('rating').notNullable()
      table.string('comment')

      table.integer('book_id').notNullable().unsigned()
      table.integer('user_id').notNullable().unsigned()

      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.foreign('book_id').references('id').inTable('books').onDelete('CASCADE')
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

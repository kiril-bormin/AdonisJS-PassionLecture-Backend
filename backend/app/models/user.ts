import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import type { Hash } from '@adonisjs/core/hash'
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
import env from '#start/env'

/**
 * Factory qui retourne un hasher bcrypt enrichi du poivre (pepper).
 *
 * Le poivre est une valeur secrète stockée uniquement côté serveur
 * (variable d'environnement HASH_PEPPER), jamais en base de données.
 *
 * Il est concaténé au mot de passe avant le hashage et la vérification :
 *   - Inscription / màj mdp : bcrypt.make(mdp + pepper)       → stocké en BDD
 *   - Login               : bcrypt.verify(hash_bdd, mdp + pepper) → OK/KO
 *
 * Cette factory est passée à withAuthFinder qui l'utilise automatiquement
 * dans son hook beforeSave (hashage) et dans verifyPassword (vérification).
 */
function pepperedBcryptFactory(): Hash {
  const pepper = env.get('HASH_PEPPER')
  const bcryptHasher = hash.use('bcrypt')

  return {
    async make(value: string): Promise<string> {
      return bcryptHasher.make(value + pepper)
    },
    async verify(hashedValue: string, plainValue: string): Promise<boolean> {
      return bcryptHasher.verify(hashedValue, plainValue + pepper)
    },
    isValidHash(value: string): boolean {
      return bcryptHasher.isValidHash(value)
    },
    async needsReHash(value: string): Promise<boolean> {
      return bcryptHasher.needsReHash(value)
    },
    async assertEquals(hashedValue: string, plainValue: string): Promise<void> {
      return bcryptHasher.assertEquals(hashedValue, plainValue + pepper)
    },
    async assertNotEquals(hashedValue: string, plainValue: string): Promise<void> {
      return bcryptHasher.assertNotEquals(hashedValue, plainValue + pepper)
    },
  } as unknown as Hash
}

const AuthFinder = withAuthFinder(pepperedBcryptFactory, {
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

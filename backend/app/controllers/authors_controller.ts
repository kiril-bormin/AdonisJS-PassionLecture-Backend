import Author from '#models/author'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthorsController {
  async index({ request }: HttpContext) {
    const q = request.input('q')
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)

    const query = Author.query()

    if (q) {
      query.where((builder) => {
        builder.whereILike('firstname', `%${q}%`).orWhereILike('lastname', `%${q}%`)
      })
    }
    if (page) {
      return query.paginate(page, limit)
    }
    return query
  }

  async show({ params }: HttpContext) {
    return Author.query().where('id', params.id)
  }

  async store({ request, auth, response }: HttpContext) {
    const user = await auth.authenticate()

    const payload = {
      firstname: request.input('firstname'),
      lastname: request.input('lastname'),
      createdByUserId: user.id,
    }

    const author = await Author.create(payload)
    return response.created(author)
  }

  async update() {
    // mettre à jour les informations d'un auteur
  }

  async destroy() {
    // supprimer un auteur
  }
}

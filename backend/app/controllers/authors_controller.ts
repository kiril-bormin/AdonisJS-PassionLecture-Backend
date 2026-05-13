import Author from '#models/author'
import type { HttpContext } from '@adonisjs/core/http'
import { messages } from '@vinejs/vine/defaults'

export default class AuthorsController {
  async index({ request }: HttpContext) {
    const q = request.input('q')
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)

    const query = Author.query().preload('createdByUser', (userQuery) => {
      // createdByUser => nom de la relation dans le modèle, puis avec userQuery on fait la requête dans la db
      userQuery.select(['id', 'pseudo']) // preload uniquement l'id et le pseudo de user
    })

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
    return Author.query()
      .where('id', params.id)
      .preload('createdByUser', (userQuery) => {
        userQuery.select(['id', 'pseudo'])
      })
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

  async update({ params, auth, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const author = await Author.findOrFail(params.id) // on récupère l'autheur par son id

    if (author.createdByUserId !== user.id && user.role !== 'admin') {
      return response.forbidden({ message: 'Vous n`êtes pas autorisé à modifier ce livre.' })
    }

    author.merge({
      firstName: request.input('firstname', author.firstName),
      lastName: request.input('lastname', author.lastName),
      createdByUserId: user.id,
    })
    await author.save()
    return author
  }
  async destroy({ auth, params, response }: HttpContext) {
    const user = await auth.authenticate()
    const author = await Author.findOrFail(params.id)

    if (author.createdByUserId !== user.id && user.role !== 'admin') {
      return response.forbidden({ message: 'Vous n`êtes pas autorisé à modifier ce livre.' })
    }

    await author.delete() // supprimer l'auteur
    return response.noContent() // renvoie le code 204 ( No Content )
  }
}

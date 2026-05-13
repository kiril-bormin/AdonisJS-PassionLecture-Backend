import Publisher from '#models/publisher'
import type { HttpContext } from '@adonisjs/core/http'
import { messages } from '@vinejs/vine/defaults'

export default class PublishersController {
  async index({ request }: HttpContext) {
    const q = request.input('q')
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)

    const query = Publisher.query().preload('createdByUser', (userQuery) => {
      // createdByUser => nom de la relation dans le modèle, puis avec userQuery on fait la requête dans la db
      userQuery.select(['id', 'pseudo']) // preload uniquement l'id et le pseudo de user
    })

    if (q) {
      query.where((builder) => {
        builder.whereILike('name', `%${q}%`)
      })
    }
    if (page) {
      return query.paginate(page, limit)
    }
    return query
  }

  async show({ params }: HttpContext) {
    return Publisher.query()
      .where('id', params.id)
      .preload('createdByUser', (userQuery) => {
        userQuery.select(['id', 'pseudo'])
      })
  }

  async store({ request, auth, response }: HttpContext) {
    const user = await auth.authenticate()

    const payload = {
      name: request.input('name'),
      createdByUserId: user.id,
    }

    const publisher = await Publisher.create(payload)
    return response.created(publisher)
  }

  async update({ params, auth, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const publisher = await Publisher.findOrFail(params.id) // on récupère l'autheur par son id

    if (publisher.createdByUserId !== user.id && user.role !== 'admin') {
      return response.forbidden({ message: 'Vous n`êtes pas autorisé à modifier ce livre.' })
    }

    publisher.merge({
      name: request.input('firstname', publisher.name),
      createdByUserId: user.id,
    })
    await publisher.save()
    return publisher
  }
  async destroy({ auth, params, response }: HttpContext) {
    const user = await auth.authenticate()
    const publisher = await Publisher.findOrFail(params.id)

    if (publisher.createdByUserId !== user.id && user.role !== 'admin') {
      return response.forbidden({ message: 'Vous n`êtes pas autorisé à modifier ce livre.' })
    }

    await publisher.delete() // supprimer l'auteur
    return response.noContent() // renvoie le code 204 ( No Content )
  }
}

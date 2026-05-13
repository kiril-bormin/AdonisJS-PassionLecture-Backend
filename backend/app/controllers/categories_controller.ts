import Categorie from '#models/category'
import type { HttpContext } from '@adonisjs/core/http'
import { messages } from '@vinejs/vine/defaults'

export default class CategoriesController {
  async index({ request }: HttpContext) {
    const q = request.input('q')
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)

    const query = Categorie.query().preload('createdByUser', (userQuery) => {
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
    return Categorie.query()
      .where('id', params.id)
      .preload('createdByUser', (userQuery) => {
        userQuery.select(['id', 'pseudo'])
      })
  }

  async store({ request, auth, response }: HttpContext) {
    const user = await auth.authenticate()

    const payload = {
      label: request.input('label'),
      createdByUserId: user.id,
    }

    const category = await Categorie.create(payload)
    return response.created(category)
  }

  async update({ params, auth, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const category = await Categorie.findOrFail(params.id) // on récupère l'autheur par son id

    if (category.createdByUserId !== user.id && user.role !== 'admin') {
      return response.forbidden({ message: 'Vous n`êtes pas autorisé à modifier cette category.' })
    }

    category.merge({
      label: request.input('firstname', category.label),
      createdByUserId: user.id,
    })
    await category.save()
    return category
  }
  async destroy({ auth, params, response }: HttpContext) {
    const user = await auth.authenticate()
    const category = await Categorie.findOrFail(params.id)

    if (category.createdByUserId !== user.id && user.role !== 'admin') {
      return response.forbidden({ message: 'Vous n`êtes pas autorisé à modifier cette category.' })
    }

    await category.delete() // supprimer l'auteur
    return response.noContent() // renvoie le code 204 ( No Content )
  }
}

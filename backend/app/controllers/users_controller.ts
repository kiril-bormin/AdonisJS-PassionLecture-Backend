import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { userUpdateValidator } from '#validators/user'

export default class UsersController {
  async index({ request }: HttpContext) {
    const q = request.input('q')
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)

    const query = User.query()

    if (q) {
      query.where((builder) => {
        builder.whereILike('pseudo', `%${q}%`).orWhereILike('email', `%${q}%`)
      })
    }
    if (page) {
      return query.paginate(page, limit)
    }
    return query
  }

  async show({ params }: HttpContext) {
    return User.query().where('id', params.id)
  }
  async updateRole({ params, request, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const role = request.input('role')

    if (role !== 'admin' && role !== 'user') {
      return response.badRequest({ message: 'Rôle invalide.' })
    }

    user.role = role
    await user.save()

    return user
  }
  async update({ params, auth, request, response }: HttpContext) {
    const currentUser = await auth.authenticate()
    const user = await User.findOrFail(params.id)

    if (currentUser.id !== user.id && currentUser.role !== 'admin') {
      return response.forbidden({ message: "Vous n'êtes pas autorisé à modifier cet utilisateur." })
    }

    const validatedData = await userUpdateValidator.validate({
      pseudo: request.input('pseudo', user.pseudo),
      email: request.input('email', user.email),
    })

    user.merge(validatedData)

    await user.save()
    return user
  }

  async destroy({ params, auth, response }: HttpContext) {
    const currentUser = await auth.authenticate()
    const user = await User.findOrFail(params.id)

    if (currentUser.id !== user.id && currentUser.role !== 'admin') {
      return response.forbidden({
        message: "Vous n'êtes pas autorisé à supprimer cet utilisateur.",
      })
    }

    await user.delete()
    return response.noContent()
  }
}

import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
  async register({ auth, request, response }: HttpContext) {
    const pseudo = request.input('pseudo', request.input('username'))

    const user = await User.create({
      pseudo,
      email: request.input('email'),
      password: request.input('password'),
      role: request.input('role', 'user'),
    })

    const token = await auth.use('api').createToken(user)

    return response.created({
      user,
      token: token.toJSON(),
    })
  }

  async login({ auth, request }: HttpContext) {
    const user = await User.verifyCredentials(request.input('email'), request.input('password'))
    const token = await auth.use('api').createToken(user)

    return {
      user,
      token: token.toJSON(),
    }
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('api').authenticate()
    await auth.use('api').invalidateToken()

    return response.noContent()
  }
}

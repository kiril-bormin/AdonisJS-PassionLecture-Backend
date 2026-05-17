import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'

export default class AuthController {
  async register({ auth, request, response }: HttpContext) {
    const pseudo = request.input('pseudo', request.input('username')) // s'assurer que l'utilisateur aura un pseudo

    const validatedData = await registerValidator.validate({
      pseudo,
      email: request.input('email'),
      password: request.input('password'),
    })

    const user = await User.create({
      // créer le nouveau user
      pseudo: validatedData.pseudo,
      email: validatedData.email,
      password: validatedData.password,
      role: 'user',
    })

    const token = await auth.use('api').createToken(user) //

    return response.created({
      user,
      token: token.toJSON(), // retourner le token
    })
  }

  async login({ auth, request }: HttpContext) {
    const validatedData = await loginValidator.validate({
      email: request.input('email'),
      password: request.input('password'),
    })

    const user = await User.verifyCredentials(validatedData.email, validatedData.password) // vérifie le mail et le mdp
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

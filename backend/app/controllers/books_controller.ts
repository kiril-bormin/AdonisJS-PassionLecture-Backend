import type { HttpContext } from '@adonisjs/core/http'
import Book from '#models/book'

export default class BooksController {
  async index({ request }: HttpContext) {
    // récupèrer les filtres de recherche
    const q = request.input('q') // q => pour querry, se trouve dans l'url ex: GET /books?q=aventure
    const categoryId = request.input('categoryId')
    const authorId = request.input('authorId')
    const publisherId = request.input('publisherId')
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)

    const query = Book.query() // préparation d'une rêquete avec des champs préchargés
      .preload('author')
      .preload('category')
      .preload('publisher')
      .preload('user')

    if (q) {
      // si q n'est pas null ou indifined
      query.where((builder) => {
        // execute le filtre
        builder.whereILike('title', `%${q}%`).orWhereILike('summary', `%${q}%`) // whereILike ignore la case, % -> pour les caractères jokers
      })
    }

    if (categoryId) {
      query.where('categoryId', categoryId)
    }

    if (authorId) {
      query.where('authorId', authorId)
    }

    if (publisherId) {
      query.where('publisherId', publisherId)
    }

    if (page) {
      return query.paginate(page, limit) // .paginate calcul automatiquement les sauts en fonction de limit
    }

    return query
  }

  async show({ params }: HttpContext) {
    // détails d'un livre spécifique
    return Book.query()
      .where('id', params.id)
      .preload('author')
      .preload('category')
      .preload('publisher')
      .preload('user')
      .preload('reviews')
      .firstOrFail() // récupère le premier id (vue qu'il est unique)l
  }

  async store({ auth, request, response }: HttpContext) {
    const user = await auth.authenticate() // si l'utilisateur est mal authentifié(token invalide, expiré ou absent), la méthode s'arrête (retourne 401 Unauthorized)

    const pagesCount = request.input('pagesCount', request.input('pages')) // serveur cherche "pagesCount" dans le body de la requête envoyée par l'utilisateur, si ce champ n'est pas présent,
    // il essaie de trouve un champ nommé "pages". C'est fait afin de s'assurer qu'on recevra le nombre de page peu importe comment le champ s'appelle.
    const editionYear = request.input('editionYear', request.input('year'))
    const extractUrl = request.input('extractUrl', request.input('excerptUrl'))

    const payload = {
      // dans payload on récupère les données du body (ainsi que les 3 variables qu'on a crée plus haut)
      title: request.input('title'),
      summary: request.input('summary'),
      pagesCount,
      editionYear,
      extractUrl,
      coverUrl: request.input('coverUrl'),
      categoryId: request.input('categoryId'),
      authorId: request.input('authorId'),
      publisherId: request.input('publisherId'),
      userId: user.id,
    }

    const book = await Book.create(payload) // création du livre dans la db
    response.created(book) // envoyer la réponse 201 (Created) avec l'objet créé
  }

  async update({ auth, params, request, response }: HttpContext) {
    const user = await auth.authenticate() // vérifier si l'utilisateur est authentifié
    const book = await Book.findOrFail(params.id) // on récupère le livre par son id

    if (book.userId !== user.id && user.role !== 'admin') {
      // vérification si l'utilisateur est propriétaire du livre ou admin
      return response.forbidden({ message: 'Vous n`êtes pas autorisé à modifier ce livre.' }) // retourne l'erreur 403 forbidden (manque de permissions)
    }

    const pagesCount = request.input('pagesCount', request.input('pages'))
    const editionYear = request.input('editionYear', request.input('year'))
    const extractUrl = request.input('extractUrl', request.input('excerptUrl'))

    book.merge({
      // merger les changements
      title: request.input('title', book.title), // deuxième valeur est la valeur par défaut
      summary: request.input('summary', book.summary),
      pagesCount: pagesCount ?? book.pagesCount,
      editionYear: editionYear ?? book.editionYear,
      extractUrl: extractUrl ?? book.extractUrl,
      coverUrl: request.input('coverUrl', book.coverUrl),
      categoryId: request.input('categoryId', book.categoryId),
      authorId: request.input('authorId', book.authorId),
      publisherId: request.input('publisherId', book.publisherId),
    })

    await book.save()
    return book
  }

  async destroy({ auth, params, response }: HttpContext) {
    const user = await auth.authenticate()
    const book = await Book.findOrFail(params.id)

    if (book.userId !== user.id && user.role !== 'admin') {
      return response.forbidden({ message: 'You do not have permission to delete this book.' })
    }

    await book.delete() // supprimer le livre
    return response.noContent() // renvoie le code 204 ( No Content )
  }
}

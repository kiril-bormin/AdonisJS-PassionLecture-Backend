import type { HttpContext } from '@adonisjs/core/http'
import Book from '#models/book'

export default class BooksController {
  async index({ request }: HttpContext) {
    const q = request.input('q')
    const categoryId = request.input('categoryId')
    const authorId = request.input('authorId')
    const publisherId = request.input('publisherId')
    const page = request.input('page')
    const limit = request.input('limit', 20)

    const query = Book.query()
      .preload('author')
      .preload('category')
      .preload('publisher')
      .preload('user')

    if (q) {
      query.where((builder) => {
        builder.whereILike('title', `%${q}%`).orWhereILike('summary', `%${q}%`)
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
      return query.paginate(page, limit)
    }

    return query
  }

  async show({ params }: HttpContext) {
    return Book.query()
      .where('id', params.id)
      .preload('author')
      .preload('category')
      .preload('publisher')
      .preload('user')
      .preload('reviews')
      .firstOrFail()
  }

  async store({ auth, request, response }: HttpContext) {
    const user = await auth.authenticate()

    const pagesCount = request.input('pagesCount', request.input('pages'))
    const editionYear = request.input('editionYear', request.input('year'))
    const extractUrl = request.input('extractUrl', request.input('excerptUrl'))

    const payload = {
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

    const book = await Book.create(payload)
    response.created(book)
  }

  async update({ auth, params, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const book = await Book.findOrFail(params.id)

    if (book.userId !== user.id && user.role !== 'admin') {
      return response.forbidden({ message: 'You do not have permission to edit this book.' })
    }

    const pagesCount = request.input('pagesCount', request.input('pages'))
    const editionYear = request.input('editionYear', request.input('year'))
    const extractUrl = request.input('extractUrl', request.input('excerptUrl'))

    book.merge({
      title: request.input('title', book.title),
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

    await book.delete()
    return response.noContent()
  }
}

import type { HttpContext } from '@adonisjs/core/http'
import Review from '#models/review'
import Book from '#models/book'
import { reviewValidator } from '#validators/review'

export default class ReviewsController {
  async index({ params, request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)

    const query = Review.query()
      .where('bookId', params.id)
      .preload('user', (userQuery) => {
        userQuery.select(['id', 'pseudo'])
      })

    if (page) {
      return query.paginate(page, limit)
    }

    return query
  }

  async store({ params, auth, request, response }: HttpContext) {
    const user = await auth.authenticate()
    await Book.findOrFail(params.id)

    const validatedData = await reviewValidator.validate({
      rating: request.input('rating'),
      comment: request.input('comment'),
    })

    const payload = {
      ...validatedData,
      bookId: params.id,
      userId: user.id,
    }

    const review = await Review.create(payload)
    return response.created(review)
  }

  async update({ params, auth, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const review = await Review.findOrFail(params.id)

    if (review.userId !== user.id && user.role !== 'admin') {
      return response.forbidden({ message: 'Vous n`êtes pas autorisé à modifier cet avis.' })
    }

    const validatedData = await reviewValidator.validate({
      rating: request.input('rating', review.rating),
      comment: request.input('comment', review.comment),
    })

    review.merge(validatedData)

    await review.save()
    return review
  }

  async destroy({ params, auth, response }: HttpContext) {
    const user = await auth.authenticate()
    const review = await Review.findOrFail(params.id)

    if (review.userId !== user.id && user.role !== 'admin') {
      return response.forbidden({ message: 'Vous n`êtes pas autorisé à supprimer cet avis.' })
    }

    await review.delete()
    return response.noContent()
  }
}

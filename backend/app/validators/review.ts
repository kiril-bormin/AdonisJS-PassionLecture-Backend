import vine from '@vinejs/vine'

const reviewValidator = vine.compile(
  vine.object({
    rating: vine.number().min(1).max(5),
    comment: vine.string().trim().minLength(2).maxLength(2000),
  })
)

export { reviewValidator }

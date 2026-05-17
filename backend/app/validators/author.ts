import vine from '@vinejs/vine'

const authorValidator = vine.compile(
  vine.object({
    firstname: vine.string().trim().minLength(2).maxLength(100),
    lastname: vine.string().trim().minLength(2).maxLength(100),
  })
)

export { authorValidator }

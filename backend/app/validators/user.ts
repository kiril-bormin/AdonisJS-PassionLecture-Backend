import vine from '@vinejs/vine'

const userUpdateValidator = vine.compile(
  vine.object({
    pseudo: vine.string().trim().minLength(2).maxLength(50),
    email: vine.string().trim().email(),
  })
)

export { userUpdateValidator }

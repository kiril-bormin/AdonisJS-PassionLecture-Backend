import vine from '@vinejs/vine'

const registerValidator = vine.compile(
  vine.object({
    pseudo: vine.string().trim().minLength(2).maxLength(50),
    email: vine.string().trim().email(),
    password: vine.string().minLength(6).maxLength(255),
  })
)

const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().minLength(6).maxLength(255),
  })
)

export { loginValidator, registerValidator }

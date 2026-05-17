import vine from '@vinejs/vine'

const publisherValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(150),
  })
)

export { publisherValidator }

import vine from '@vinejs/vine'

const categoryValidator = vine.compile(
  vine.object({
    label: vine.string().trim().minLength(2).maxLength(100),
  })
)

export { categoryValidator }

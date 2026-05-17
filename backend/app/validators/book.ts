import vine from '@vinejs/vine'

const bookValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(2).maxLength(255),
    summary: vine.string(),
    pagesCount: vine.number(),
    editionYear: vine.number(),
    extractUrl: vine.string(),
    coverUrl: vine.string(),
  })
)
export { bookValidator }

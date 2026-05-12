/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import BooksController from '#controllers/books_controller'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Book routes
router.get('/books', [BooksController, 'index'])
router.get('/books/:id', [BooksController, 'show'])
router.post('/books', [BooksController, 'store']).use(middleware.auth())
router.put('/books/:id', [BooksController, 'update']).use(middleware.auth())
router.delete('/books/:id', [BooksController, 'destroy']).use(middleware.auth())

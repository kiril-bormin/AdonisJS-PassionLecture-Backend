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
import AuthController from '#controllers/auth_controller'

// Auth routes
router.post('/auth/register', [AuthController, 'register'])
router.post('/auth/login', [AuthController, 'login'])
router.post('/auth/logout', [AuthController, 'logout']).use(middleware.auth())

// Book routes
router.get('/', [BooksController, 'index'])
router.get('/books', [BooksController, 'index'])
router.get('/books/:id', [BooksController, 'show'])
router.post('/books', [BooksController, 'store']).use(middleware.auth())
router.put('/books/:id', [BooksController, 'update']).use(middleware.auth())
router.delete('/books/:id', [BooksController, 'destroy']).use(middleware.auth())

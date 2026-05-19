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
import AuthorsController from '#controllers/authors_controller'
import PublishersController from '#controllers/publishers_controller'
import CategoriesController from '#controllers/categories_controller'
import ReviewsController from '#controllers/reviews_controller'
import UsersController from '#controllers/users_controller'

// Auth routes
router.post('/auth/register', [AuthController, 'register'])
router.post('/auth/login', [AuthController, 'login'])
router.post('/auth/logout', [AuthController, 'logout']).use(middleware.auth())

// Author routes
router.get('/authors', [AuthorsController, 'index'])
router.get('/authors/:id', [AuthorsController, 'show'])
router.post('/authors', [AuthorsController, 'store']).use(middleware.auth())
router.put('/authors/:id', [AuthorsController, 'update']).use(middleware.auth())
router.delete('/authors/:id', [AuthorsController, 'destroy']).use(middleware.auth())

// Publisher routes
router.get('/publishers', [PublishersController, 'index'])
router.get('/publishers/:id', [PublishersController, 'show'])
router.post('/publishers', [PublishersController, 'store']).use(middleware.auth())
router.put('/publishers/:id', [PublishersController, 'update']).use(middleware.auth())
router.delete('/publishers/:id', [PublishersController, 'destroy']).use(middleware.auth())

// Categories routes
router.get('/categories', [CategoriesController, 'index'])
router.get('/categories/:id', [CategoriesController, 'show'])
router.post('/categories', [CategoriesController, 'store']).use(middleware.auth())
router.put('/categories/:id', [CategoriesController, 'update']).use(middleware.auth())
router.delete('/categories/:id', [CategoriesController, 'destroy']).use(middleware.auth())

// Book routes
router.get('/', [BooksController, 'index'])
router.get('/books', [BooksController, 'index'])
router.get('/books/:id', [BooksController, 'show'])
router.post('/books', [BooksController, 'store']).use(middleware.auth())
router.put('/books/:id', [BooksController, 'update']).use(middleware.auth())
router.delete('/books/:id', [BooksController, 'destroy']).use(middleware.auth())

// Review routes
router.get('/books/:id/reviews', [ReviewsController, 'index'])
router.get('/books/:id/reviews/:reviewId', [ReviewsController, 'show'])
router.post('/books/:id/reviews', [ReviewsController, 'store']).use(middleware.auth())
router.put('/books/:id/reviews/:reviewId', [ReviewsController, 'update']).use(middleware.auth())
router.delete('/books/:id/reviews/:reviewId', [ReviewsController, 'destroy']).use(middleware.auth())

// Users routes
router.get('/users', [UsersController, 'index']).use([middleware.auth(), middleware.admin()])
router.get('/users/:id', [UsersController, 'show']).use([middleware.auth(), middleware.admin()])
router.put('/users/:id', [UsersController, 'update']).use([middleware.auth(), middleware.admin()])
router
  .delete('/users/:id', [UsersController, 'destroy'])
  .use([middleware.auth(), middleware.admin()])

router
  .put('/users/:id/role', [UsersController, 'updateRole'])
  .use([middleware.auth(), middleware.admin()])

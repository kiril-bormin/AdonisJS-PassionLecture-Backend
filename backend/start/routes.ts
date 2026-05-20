/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const BooksController = () => import('#controllers/books_controller')
const AuthController = () => import('#controllers/auth_controller')
const AuthorsController = () => import('#controllers/authors_controller')
const PublishersController = () => import('#controllers/publishers_controller')
const CategoriesController = () => import('#controllers/categories_controller')
const ReviewsController = () => import('#controllers/reviews_controller')
const UsersController = () => import('#controllers/users_controller')

// Auth routes
router
  .group(() => {
    router.post('/auth/register', [AuthController, 'register'])
    router.post('/auth/login', [AuthController, 'login'])
    router.post('/auth/logout', [AuthController, 'logout']).use(middleware.auth())
  })
  .prefix('api')

// Author routes
router
  .group(() => {
    router.get('/authors', [AuthorsController, 'index'])
    router.get('/authors/:id', [AuthorsController, 'show'])
    router.post('/authors', [AuthorsController, 'store']).use(middleware.auth())
    router.put('/authors/:id', [AuthorsController, 'update']).use(middleware.auth())
    router.delete('/authors/:id', [AuthorsController, 'destroy']).use(middleware.auth())
  })
  .prefix('api')

// Publisher routes
router
  .group(() => {
    router.get('/publishers', [PublishersController, 'index'])
    router.get('/publishers/:id', [PublishersController, 'show'])
    router.post('/publishers', [PublishersController, 'store']).use(middleware.auth())
    router.put('/publishers/:id', [PublishersController, 'update']).use(middleware.auth())
    router.delete('/publishers/:id', [PublishersController, 'destroy']).use(middleware.auth())
  })
  .prefix('api')

// Categories routes
router
  .group(() => {
    router.get('/categories', [CategoriesController, 'index'])
    router.get('/categories/:id', [CategoriesController, 'show'])
    router.post('/categories', [CategoriesController, 'store']).use(middleware.auth())
    router.put('/categories/:id', [CategoriesController, 'update']).use(middleware.auth())
    router.delete('/categories/:id', [CategoriesController, 'destroy']).use(middleware.auth())
  })
  .prefix('api')

// Book routes
router
  .group(() => {
    router.get('/', [BooksController, 'index'])
    router.get('/books', [BooksController, 'index'])
    router.get('/books/:id', [BooksController, 'show'])
    router.post('/books', [BooksController, 'store']).use(middleware.auth())
    router.put('/books/:id', [BooksController, 'update']).use(middleware.auth())
    router.delete('/books/:id', [BooksController, 'destroy']).use(middleware.auth())
  })
  .prefix('api')

// Review routes
router
  .group(() => {
    router.get('/books/:id/reviews', [ReviewsController, 'index'])
    router.get('/books/:id/reviews/:reviewId', [ReviewsController, 'show'])
    router.post('/books/:id/reviews', [ReviewsController, 'store']).use(middleware.auth())
    router.put('/books/:id/reviews/:reviewId', [ReviewsController, 'update']).use(middleware.auth())
    router
      .delete('/books/:id/reviews/:reviewId', [ReviewsController, 'destroy'])
      .use(middleware.auth())
  })
  .prefix('api')

// Users routes
router
  .group(() => {
    router.get('/users', [UsersController, 'index']).use([middleware.auth(), middleware.admin()])
    router.get('/users/:id', [UsersController, 'show']).use([middleware.auth(), middleware.admin()])
    router
      .put('/users/:id', [UsersController, 'update'])
      .use([middleware.auth(), middleware.admin()])
    router
      .delete('/users/:id', [UsersController, 'destroy'])
      .use([middleware.auth(), middleware.admin()])
    router
      .put('/users/:id/role', [UsersController, 'updateRole'])
      .use([middleware.auth(), middleware.admin()])
  })
  .prefix('api')
// returns swagger in YAML
router.get('swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})
// Renders Swagger-UI and passes YAML-output of /swagger
router.get('docs', async () => {
  return AutoSwagger.default.ui('/swagger', swagger)
})

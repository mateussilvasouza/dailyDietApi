import fastify from 'fastify'
import cookie, { type FastifyCookieOptions } from '@fastify/cookie'
import { userRoutes } from './routes/users'
import { mealsRoutes } from './routes/meals'
import { authRoutes } from './routes/login'

const app = fastify({
  logger: true
})

void app.register(cookie, { secret: 'DailyDietApiCookie' } satisfies FastifyCookieOptions)
void app.register(authRoutes, { prefix: 'login' })
void app.register(userRoutes, { prefix: 'users' })
void app.register(mealsRoutes, { prefix: 'meals' })

export { app }

import { type FastifyInstance } from 'fastify'
import { z } from 'zod'
import { db } from '../database'
import bcrypt from 'bcrypt'
import { genToken } from '../middlewares/loginValidate'

export async function authRoutes (app: FastifyInstance): Promise<void> {
  const credentials = z.object({
    login: z.string(),
    password: z.string()
  })
  app.post('/', async (request, reply) => {
    try {
      const auth = credentials.safeParse(request.body)

      if (!auth.success) {
        throw new Error(auth.error.message)
      }
      const { login, password } = auth.data
      const user = await db('users').where('cpf', login).select('id', 'name', 'password', 'cpf')
      if (bcrypt.compareSync(password, user[0].password)) {
        const token = await genToken(user[0])
        void reply.setCookie('authorization', `Bearer ${token}`)
        return await reply.status(200).send()
      } else {
        return await reply.status(401).send()
      }
    } catch (error) {
      console.log(error)
      return await reply.status(500).send()
    }
  })
}

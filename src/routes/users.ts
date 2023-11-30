import { type FastifyInstance } from 'fastify'
import { db } from '../database'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { randomUUID } from 'node:crypto'

export async function userRoutes (app: FastifyInstance): Promise<void> {
  const usersBodyValidation = {
    body: z.object({
      name: z.string(),
      cpf: z.string(),
      password: z.string()
    })
  }

  app.post('/', async (request, reply) => {
    try {
      const result = usersBodyValidation.body.safeParse(request.body)

      if (!result.success) {
        throw new Error(result.error.message)
      } else {
        const { name, cpf, password } = result.data
        const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(12))

        await db('users').insert({
          id: randomUUID(),
          name,
          cpf,
          password: hashedPassword
        }).catch(async (error) => {
          throw new Error(error)
        })

        return await reply.status(201).send()
      }
    } catch (error) {
      app.log.error(error)
      return await reply.status(500).send()
    }
  })

  app.get('/', async (request, reply) => {
    try {
      const response = await db('users').select('id', 'name')
      return await reply.status(200).send({ users: response })
    } catch (error) {
      app.log.error(error)
      return await reply.status(500).send()
    }
  })
}

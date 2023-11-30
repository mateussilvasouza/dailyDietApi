import { type FastifyInstance } from 'fastify'
import { db } from '../database'
import { randomUUID } from 'node:crypto'
import { bodyValidate, paramsValidate } from '../middlewares/mealsValidationSchemas'
import { decrypt } from '../middlewares/loginValidate'

interface BodyProps {
  name: string
  description: string
  consumedAt: Date
  diet: boolean
}

interface IdentifyProps {
  id: string
}

export async function mealsRoutes (app: FastifyInstance): Promise<void> {
  app.post('/', { preHandler: [decrypt, bodyValidate] }, async (request, reply) => {
    try {
      const { id: userId } = request.headers.user as unknown as IdentifyProps

      const { name, description, consumedAt, diet } = request.body as BodyProps

      await db('meals').insert({
        id: randomUUID(),
        user_id: userId,
        name,
        description,
        consumed_at: consumedAt,
        diet
      })
      return await reply.status(201).send()
    } catch (error) {
      app.log.error(error)
      return await reply.status(500).send()
    }
  })

  app.put('/:id', { preHandler: [decrypt, bodyValidate, paramsValidate] }, async (request, reply) => {
    try {
      const { id } = request.params as IdentifyProps
      const { id: userId } = request.headers.user as unknown as IdentifyProps
      const { name, description, consumedAt, diet } = request.body as BodyProps
      await db('meals').where('deleted_at', null).andWhere('id', id).andWhere('user_id', userId).update({
        name,
        description,
        consumed_at: new Date(consumedAt).toISOString() as unknown as Date,
        updated_at: db.fn.now(),
        diet
      })

      return await reply.status(204).send()
    } catch (error) {
      app.log.error(error)
      return await reply.status(400).send(error)
    }
  })

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  app.get('/:id?', { preHandler: [decrypt] }, async (request, reply) => {
    try {
      const { id } = request.params as IdentifyProps
      if (id == null) {
        const { id: userId } = request.headers.user as unknown as IdentifyProps
        const responses = (await db('meals').where('deleted_at', null).andWhere('user_id', userId).select('id', 'name', 'description', 'consumed_at', 'diet'))
          .map(response => ({
            ...response,
            diet: Boolean(response.diet)
          }))
        return await reply.status(200).send({ meals: responses })
      } else {
        const response = (await db('meals').where('deleted_at', null).andWhere('id', id).select('id', 'name', 'description', 'consumed_at', 'diet'))
          .map(response => ({
            ...response,
            diet: Boolean(response.diet)
          }))
        return await reply.status(200).send({ meals: response })
      }
    } catch (error) {
      app.log.error(error)
      return await reply.status(500).send()
    }
  })

  app.get('/summary', { preHandler: [decrypt] }, async (request, reply) => {
    try {
      const { id: userId } = request.headers.user as unknown as IdentifyProps
      const response = await db('meals').where('deleted_at', null).andWhere('user_id', userId).select(db.raw('count (*) filter (where diet = true) as diet'),
        db.raw('count (*) filter (where diet = false) as noDiet'),
        db.raw('count (*) as total'))

      return await reply.status(200).send({ summary: response })
    } catch (error) {
      app.log.error(error)
      return await reply.status(500).send()
    }
  })

  app.delete('/:id', { preHandler: [decrypt, paramsValidate] }, async (request, reply) => {
    try {
      const { id } = request.params as IdentifyProps
      const { id: userId } = request.headers.user as unknown as IdentifyProps
      await db('meals').where('id', id).andWhere('user_id', userId).update({
        deleted_at: db.fn.now()
      })
      return await reply.status(200).send()
    } catch (error) {
      app.log.error(error)
      return await reply.status(400).send(error)
    }
  })
}

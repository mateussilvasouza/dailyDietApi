import { type FastifyRequest } from 'fastify'
import { z } from 'zod'

const mealsBodyValidation = {
  body: z.object({
    name: z.string(),
    description: z.string(),
    consumedAt: z.coerce.date(),
    diet: z.boolean()
  }),
  header: z.object({
    authorization: z.string()
  }),
  params: z.object({
    id: z.string()
  })
}

export async function headerValidate (request: FastifyRequest): Promise<void> {
  const header = mealsBodyValidation.header.safeParse(request.cookies)
  if (!header.success) {
    throw new Error(header.error.message)
  }
}

export async function bodyValidate (request: FastifyRequest): Promise<void> {
  const bodyValidate = mealsBodyValidation.body.safeParse(request.body)
  if (!bodyValidate.success) {
    throw new Error(bodyValidate.error.message)
  }
}

export async function paramsValidate (request: FastifyRequest): Promise<void> {
  const paramsValidate = mealsBodyValidation.params.safeParse(request.params)

  if (!paramsValidate.success) {
    throw new Error(paramsValidate.error.message)
  }
}

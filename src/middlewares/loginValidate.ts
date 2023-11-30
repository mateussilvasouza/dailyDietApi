import { type FastifyRequest, type FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'

const SALT = 'DailyDietApi'

interface UserProps {
  id: string
  name: string
  password: string
  cpf: string
}

export async function genToken (user: UserProps): Promise<string> {
  const payload = {
    id: user.id,
    name: user.name
  }
  return jwt.sign(payload, SALT, { algorithm: 'HS256', expiresIn: '30m' })
}

export async function decrypt (request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const token = request.headers.cookie?.replace('authorization=', '').replace('Bearer%20', '') as string
  // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression, @typescript-eslint/no-misused-promises
  jwt.verify(token, SALT, (err, decode) => {
    if (err != null) {
      console.log(err)
      return reply.status(401).send()
    }
    request.headers = { user: decode as string }
  })
}

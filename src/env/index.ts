import z from 'zod'
import { config } from 'dotenv'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DB_CLIENT: z.enum(['sqlite', 'pg']).default('sqlite'),
  DATABASE_URL: z.string(),
  DB_HOST: z.string(),
  PORT: z.coerce.number().default(8000),
  DB_USER: z.string(),
  DB_NAME: z.string(),
  DB_PASSWORD: z.string()
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('Invalid enviroment variables, check the erros below!', _env.error.format())
  throw new Error('Invalid enviroment variables')
}

export const env = _env.data

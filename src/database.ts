import knex, { type Knex } from 'knex'
import { env } from './env'

export const config: Knex.Config = {
  client: env.DB_CLIENT,
  connection: (env.DB_CLIENT === 'sqlite')
    ? {
        filename: env.DATABASE_URL
      }
    : {
        connectionString: env.DATABASE_URL,
        host: env.DB_HOST,
        port: env.PORT,
        user: env.DB_USER,
        database: env.DB_NAME,
        password: env.DB_PASSWORD
      },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations'
  }
}

export const db = knex(config)

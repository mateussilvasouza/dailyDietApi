// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  interface User {
    id: string
    name: string
    cpf: string
    password: string
    created_at: Date
    updated_at: Date
    deleted_at: Date
  }
  interface Meal {
    id: string
    user_id: string
    name: string
    description?: string
    consumed_at: Date
    diet: boolean
    created_at: Date
    updated_at: Date
    deleted_at: Date
  }

  export interface Tables {
    // This is same as specifying `knex<User>('users')`
    users: User
    meals: Meal
  }
}

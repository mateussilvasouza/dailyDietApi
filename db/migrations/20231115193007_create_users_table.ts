import { type Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  await knex.schema.createTable('users', function (table) {
    table.uuid('id', { primaryKey: true })
    table.string('name', 255).notNullable()
    table.string('cpf', 11).unique().notNullable()
    table.string('password', 255).notNullable()
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now())
    table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now())
    table.timestamp('deleted_at', { useTz: true }).nullable()
  })
}

export async function down (knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
}

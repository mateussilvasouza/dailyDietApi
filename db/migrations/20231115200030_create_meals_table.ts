import { type Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', function (table) {
    table.uuid('id', { primaryKey: true })
    table.uuid('user_id').notNullable()
    table.foreign('user_id').references('id').inTable('users')
    table.string('name', 255).notNullable()
    table.text('description', 'string').nullable()
    table.timestamp('consumed_at', { useTz: true }).notNullable()
    table.boolean('diet').notNullable()
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now())
    table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now())
    table.timestamp('deleted_at', { useTz: true }).nullable()
  })
}

export async function down (knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}

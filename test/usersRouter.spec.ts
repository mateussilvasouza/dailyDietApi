import { describe, it, beforeAll, afterEach, beforeEach, afterAll, expect } from 'vitest'
import { execSync } from 'node:child_process'
import { app } from '../src/app'
import request from 'supertest'

describe('UserRoutes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run migrate-latest')
  })

  afterEach(() => {
    execSync('npm run migrate-rollback -all')
  })

  it('should be possible to create a new user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Julius',
        cpf: '11111111111',
        password: '12345'
      })
      .expect(201)
  })

  it('should not be possible to create a user with a CPF already registered', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Julius',
        cpf: '11111111111',
        password: '12345'
      })

    await request(app.server)
      .post('/users')
      .send({
        name: 'Julius',
        cpf: '11111111111',
        password: '12345'
      }).expect(500)
  })

  it('should not be possible to create a user without the necessary information', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Julius',
        cpf: '11111111111'
      }).expect(500)
  })

  it('must be possible to list existing users.', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Julius',
        cpf: '11111111111',
        password: '12345'
      })

    const getUsers = await request(app.server)
      .get('/users')
      .expect(200)

    expect(getUsers.body.users).toEqual([
      expect.objectContaining({
        name: 'Julius'
      })
    ])
  })
})

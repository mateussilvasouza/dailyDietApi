import { describe, it, beforeAll, afterEach, beforeEach, afterAll, expect } from 'vitest'
import { execSync } from 'node:child_process'
import { app } from '../src/app'
import request from 'supertest'

describe('LoginRoutes', () => {
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

  it('must be possible to login and receive the validation token', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Julius',
        cpf: '11111111111',
        password: '12345'
      })

    const user = await request(app.server)
      .post('/login')
      .send({
        login: '11111111111',
        password: '12345'
      }).expect(200)

    expect(user.get('Set-Cookie')).toEqual([
      expect.stringContaining('authorization=Bearer%')
    ])
  })

  it('should not be possible to log in with incorrect credentials.', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Julius',
        cpf: '11111111111',
        password: '12345'
      })

    await request(app.server)
      .post('/login')
      .send({
        login: '11111111111',
        password: '1234'
      }).expect(401)
  })

  it('should not be possible to log in without credentials.', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Julius',
        cpf: '11111111111',
        password: '12345'
      })

    await request(app.server)
      .post('/login')
      .send({
        login: '11111111111'
      }).expect(500)
  })
})

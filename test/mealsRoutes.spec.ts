import { describe, it, beforeAll, afterEach, beforeEach, afterAll, expect } from 'vitest'
import { execSync } from 'node:child_process'
import { app } from '../src/app'
import request from 'supertest'

describe('MealsRoutes', () => {
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

  it('should not be possible to create meals without being logged in', async () => {
    await request(app.server)
      .post('/meals')
      .send({
        name: 'Mamão',
        description: 'Lanche da Tarde',
        consumedAt: new Date(),
        diet: true
      }).expect(401)
  })

  it('should be possible to create meals while authenticated.', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Julius',
        cpf: '11111111111',
        password: '12345'
      })

    const login = await request(app.server)
      .post('/login')
      .send({
        login: '11111111111',
        password: '12345'
      })

    const token = login.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', token)
      .send({
        name: 'Mamão',
        description: 'Lanche da Tarde',
        consumedAt: new Date(),
        diet: true
      }).expect(201)
  })

  it('should not be possible to create meals with missing information.', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Julius',
        cpf: '11111111111',
        password: '12345'
      })

    const login = await request(app.server)
      .post('/login')
      .send({
        login: '11111111111',
        password: '12345'
      })

    const token = login.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', token)
      .send({
        name: 'Mamão',
        consumedAt: new Date(),
        diet: true
      }).expect(500)
  })

  it('must be possible to list the authenticated user\'s meals.', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Julius',
        cpf: '11111111111',
        password: '12345'
      })

    const login = await request(app.server)
      .post('/login')
      .send({
        login: '11111111111',
        password: '12345'
      })

    const token = login.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', token)
      .send({
        name: 'Mamão',
        description: 'Lanche da Tarde',
        consumedAt: new Date(),
        diet: true
      })

    const meals = await request(app.server)
      .get('/meals')
      .set('Cookie', token)
      .expect(200)

    expect(meals.body.meals).toEqual([
      expect.objectContaining({
        name: 'Mamão',
        description: 'Lanche da Tarde',
        diet: true
      })
    ])
  })

  it('must be possible to list a single meal from the authenticated user.', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Julius',
        cpf: '11111111111',
        password: '12345'
      })

    const login = await request(app.server)
      .post('/login')
      .send({
        login: '11111111111',
        password: '12345'
      })

    const token = login.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', token)
      .send({
        name: 'Mamão',
        description: 'Lanche da Tarde',
        consumedAt: new Date(),
        diet: true
      })

    const listMeals = await request(app.server)
      .get('/meals')
      .set('Cookie', token)
      .expect(200)

    const mealId = listMeals.body.meals[0].id

    const meals = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', token)
      .expect(200)

    expect(meals.body.meals).toEqual([
      expect.objectContaining({
        name: 'Mamão',
        description: 'Lanche da Tarde',
        diet: true
      })
    ])
  })

  it('must be possible to delete a meal from the logged in user.', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Julius',
        cpf: '11111111111',
        password: '12345'
      })

    const login = await request(app.server)
      .post('/login')
      .send({
        login: '11111111111',
        password: '12345'
      })

    const token = login.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', token)
      .send({
        name: 'Mamão',
        description: 'Lanche da Tarde',
        consumedAt: new Date(),
        diet: true
      })

    const listMeals = await request(app.server)
      .get('/meals')
      .set('Cookie', token)
      .expect(200)

    const mealId = listMeals.body.meals[0].id

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', token)
      .expect(200)

    const meals = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', token)
      .expect(200)

    expect(meals.body.meals).toEqual([])
  })

  it('should be possible to change a logged in user\'s meal', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Julius',
        cpf: '11111111111',
        password: '12345'
      })

    const login = await request(app.server)
      .post('/login')
      .send({
        login: '11111111111',
        password: '12345'
      })

    const token = login.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', token)
      .send({
        name: 'Mamão',
        description: 'Lanche da Tarde',
        consumedAt: new Date(),
        diet: true
      })

    const listMeals = await request(app.server)
      .get('/meals')
      .set('Cookie', token)
      .expect(200)

    const mealId = listMeals.body.meals[0].id

    await request(app.server)
      .put(`/meals/${mealId}`)
      .set('Cookie', token)
      .send({
        name: 'Uva',
        description: 'Café da Manhã',
        consumedAt: new Date(),
        diet: true
      })

    const meals = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', token)
      .expect(200)

    expect(meals.body.meals).toEqual([
      expect.objectContaining({
        name: 'Uva',
        description: 'Café da Manhã',
        diet: true
      })
    ])
  })
})

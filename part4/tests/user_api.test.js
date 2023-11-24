const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const User = require('../models/user')

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secretpass', 10)
    const user = new User({ username: 'original', passwordHash })

    await user.save()
  })

  test('creation success with new username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'rzhao',
      name: 'Roland Zhao',
      password: 'dragonfire',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper status and message if username exists', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'original',
      name: 'Duplicate Dude',
      password: 'copier',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})

describe('creation of a user', () => {
  test('fails if password is less than 3 characters long', async () => {
    const newUser = {
      username: 'bobjoe',
      name: 'Bobby',
      password: 'oh',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toContain('Password must be at least 3 characters long')
  })

  test('fails if username is less than 3 characters long', async () => {
    const newUser = {
      username: 'we',
      name: 'Wendy',
      password: 'wendy101',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toContain('Username must be at least 3 characters long')
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
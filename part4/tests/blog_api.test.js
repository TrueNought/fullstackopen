const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Test Blog',
    author: 'Tester 1',
    url: 'https://test1.com',
    likes: 33
  },
  {
    title: 'Another Test',
    author: 'Tester 2',
    url: 'https://test2.com',
    likes: 20
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('correct number of blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length)
})

test('id property of each blog exists', async () => {
  const response = await api.get('/api/blogs')
  console.log(response.body)
  response.body.forEach(blog => {
    expect(blog.id).toBeDefined()
  })
})

test('new blog can be successfully added', async () => {
  const newBlog = {
    title: 'Newly Added Blog',
    author: 'Newbie',
    url: 'https://new.com',
    likes: 1
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const titles = response.body.map(blog => blog.title)
  expect(response.body).toHaveLength(initialBlogs.length + 1)
  expect(titles).toContain('Newly Added Blog')
})

test('missing likes property in request defaults to 0', async () => {
  const newBlog = {
    title: 'No Likes Property',
    author: 'Someone',
    url: 'https://something.com'
  }

  const response = await api.post('/api/blogs').send(newBlog)
  expect(response.body.likes).toEqual(0)
})

describe('bad request response', () => {
  test('if title is missing', async () => {
    const newBlog = {
      author: 'No Title',
      url: 'https://notitle.com'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

  test('if author is missing', async () => {
    const newBlog = {
      title: 'No Author',
      url: 'https://noauthor.com'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})


afterAll(async () => {
  await mongoose.connection.close()
})
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  console.log('cleared')

  helper.initialBlogs.forEach(async blog => {
    let blogObject = new Blog(blog)
    await blogObject.save()
    console.log('saved')
  })
  console.log('done')
})

describe('when there are blog entries', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('correct number of blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('id property of each blog exists', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
      expect(blog.id).toBeDefined()
    })
  })
})

describe('when adding a new blog', () => {
  test('successful when request is valid', async () => {
    const newBlog = {
      title: 'Newly Added Blog',
      author: 'Newbie',
      url: 'https://new.com',
      likes: 1,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const dbBlogs = await helper.blogsInDb()
    expect(dbBlogs).toHaveLength(helper.initialBlogs.length + 1)

    const urls = dbBlogs.map(blog => blog.url)
    expect(urls).toContain('https://new.com')
  })

  test('missing likes property in request defaults it to 0', async () => {
    const newBlog = {
      title: 'No Likes Property',
      author: 'Someone',
      url: 'https://something.com',
    }

    const response = await api.post('/api/blogs').send(newBlog)
    expect(response.body.likes).toEqual(0)
  })

  test('bad request if title is missing', async () => {
    const newBlog = {
      author: 'No Title',
      url: 'https://notitle.com',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

  test('bad request if author is missing', async () => {
    const newBlog = {
      title: 'No Author',
      url: 'https://noauthor.com',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})

describe('deleting a blog', () => {
  test('succeeds with status of 204 if id is valid', async () => {
    const blogsStart = await helper.blogsInDb()
    const blogToRemove = blogsStart[0]

    await api
      .delete(`/api/blogs/${blogToRemove.id}`)
      .expect(204)

    const blogsEnd = await helper.blogsInDb()
    expect(blogsEnd).toHaveLength(blogsStart.length - 1)

    const urls = blogsEnd.map(blog => blog.url)
    expect(urls).not.toContain(blogToRemove.content)
  })
})

describe('updating a blog', () => {
  test('succeeds with valid data', async () => {
    const blogsStart = await helper.blogsInDb()
    const blogToUpdate = blogsStart[0]
    const newBlogData = {
      likes: 100,
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlogData)
      .expect(200)

    const blogsEnd = await helper.blogsInDb()
    expect(blogsEnd[0].likes).toEqual(100)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
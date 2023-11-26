const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

let token

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('test', 10)
  const user = new User({ username: 'test', password: passwordHash })
  await user.save()

  const userToken = {
    username: user.username,
    id: user._id,
  }
  token = jwt.sign(userToken, process.env.SECRET)

  await Blog.deleteMany({})

  helper.initialBlogs.forEach(async blog => {
    let blogObject = new Blog(blog)
    await blogObject.save()
  })
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
  test('successful when request and authorization are valid', async () => {
    const newBlog = {
      url: 'https://new.com',
      title: 'Newly Added Blog',
      author: 'Newbie',
      likes: 1,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
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

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)

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
      .set('Authorization', `Bearer ${token}`)
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
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
  })

  test('fails with 401 status if token is not provided', async () => {
    const newBlog = {
      url: 'https://noauth.com',
      title: 'Not Authorized to Add',
      author: 'Rando',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', '')
      .expect(401)
  })
})

describe('deleting a blog', () => {
  test('succeeds with 204 status if id is valid', async () => {
    const blogToRemove = {
      url: 'https://removethis.com',
      title: 'Will Be Deleted',
      author: 'Recycling',
    }

    const result = await api
      .post('/api/blogs')
      .send(blogToRemove)
      .set('Authorization', `Bearer ${token}`)

    const blogsBefore = await helper.blogsInDb()

    await api
      .delete(`/api/blogs/${result.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter).toHaveLength(blogsBefore.length - 1)

    const urls = blogsAfter.map(blog => blog.url)
    expect(urls).not.toContain(blogToRemove.content)
  })
})

// describe('updating a blog', () => {
//   test('succeeds with valid data', async () => {
//     const blogsStart = await helper.blogsInDb()
//     const blogToUpdate = blogsStart[0]
//     const newBlogData = {
//       likes: 100,
//     }

//     await api
//       .put(`/api/blogs/${blogToUpdate.id}`)
//       .send(newBlogData)
//       .expect(200)

//     const blogsEnd = await helper.blogsInDb()
//     expect(blogsEnd[0].likes).toEqual(100)
//   })
// })

afterAll(async () => {
  await mongoose.connection.close()
})
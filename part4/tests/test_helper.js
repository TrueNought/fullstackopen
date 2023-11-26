const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    url: 'https://test1.com',
    title: 'Test Blog',
    author: 'Tester 1',
    likes: 33,
  },
  {
    url: 'https://test2.com',
    title: 'Another Test',
    author: 'Tester 2',
    likes: 20,
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb,
}
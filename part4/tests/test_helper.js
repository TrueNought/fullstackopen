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

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb
}
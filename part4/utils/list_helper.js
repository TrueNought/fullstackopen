const _ = require('lodash')

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => {
    return total + blog.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }
  const favorite = blogs.reduce((most, blog) => {
    return blog.likes > most.likes
      ? blog
      : most
  }, blogs[0])

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  }
}

const mostBlogs = (blogs) => {
  const groupedByAuthor = _.groupBy(blogs, 'author')
  const authorMost = _.maxBy(Object.keys(groupedByAuthor), author => groupedByAuthor[author].length)

  return {
    author: authorMost,
    blogs: groupedByAuthor[authorMost].length,
  }
}

const mostLikes = (blogs) => {
  const groupedByAuthor = _.groupBy(blogs, 'author')
  const authorMost = _.maxBy(Object.keys(groupedByAuthor), author => {
    return groupedByAuthor[author].reduce((total, blog) => {
      return total + blog.likes
    }, 0)
  })

  return {
    author: authorMost,
    likes: _.sumBy(groupedByAuthor[authorMost], 'likes'),
  }
}

module.exports =  {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
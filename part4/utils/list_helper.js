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

module.exports =  {
  totalLikes,
  favoriteBlog,
}
import { useState } from 'react'

const Blog = ({ blog, user, updateBlog, deleteBlog }) => {
  const [viewVisible, setViewVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const handleLike = () => {
    updateBlog({ ...blog, likes: blog.likes + 1 })
  }

  const handleDelete = () => {
    deleteBlog(blog)
  }

  const blogDetails = () => {
    return (
      <>
        {blog.url}<br />
        {`likes: ${blog.likes} `}<button onClick={handleLike}>like</button><br />
        {blog.user.name}<br />
        {user.username === blog.user.username && <button onClick={handleDelete}>remove</button>}
      </>
    )
  }

  return (
    <div style={blogStyle}>
      <div>
        {`${blog.title} | ${blog.author} `}
        <button onClick={() => setViewVisible(!viewVisible)}>
          {viewVisible
            ? 'hide'
            : 'view'}
        </button>
      </div>
      {viewVisible && blogDetails()}
    </div>
  )}

export default Blog
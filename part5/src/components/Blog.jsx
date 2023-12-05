import { useState } from 'react'

const Blog = ({ blog, user, handleLike, handleDelete }) => {
  const [viewVisible, setViewVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const blogDetails = () => {
    return (
      <>
        {blog.url}<br />
        {`likes: ${blog.likes} `}<button onClick={handleLike} className='likeButton'>like</button><br />
        {blog.user.name}<br />
        {user.username === blog.user.username && <button onClick={handleDelete}>remove</button>}
      </>
    )
  }

  return (
    <div style={blogStyle}>
      <div>
        {`${blog.title} | ${blog.author} `}
        <button onClick={() => setViewVisible(!viewVisible)} className='visibilityToggle'>
          {viewVisible
            ? 'hide'
            : 'view'}
        </button>
      </div>
      {viewVisible && blogDetails()}
    </div>
  )}

export default Blog
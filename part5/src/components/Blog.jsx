import { useState } from 'react'

const Blog = ({ blog }) => {
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
        likes: {blog.likes} {''}<button>like</button><br />
        {blog.user.name}<br />
      </>
    )
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} | {blog.author} {''} 
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
import { useState } from 'react'

const BlogView = ({ blog, user, handleLike, handleDelete, handleComment }) => {
  const [comment, setComment] = useState('')

  const addComment = (event) => {
    event.preventDefault()
    handleComment(blog.id, comment)
    setComment('')
  }

  if (!blog) {
    return null
  }
  return (
    <div>
      <div>
        <h2>{blog.title}</h2>
        {blog.url}
        <br />
        {`likes: ${blog.likes} `}
        <button onClick={handleLike} className="likeButton">
          like
        </button>
        <br />
        added by {blog.user.name}
        <br />
        {user.username === blog.user.username && (
          <button onClick={handleDelete}>remove</button>
        )}
      </div>
      <div>
        <h3>Comments</h3>
        <form onSubmit={addComment}>
          <input
            name="comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
          <button type="submit">add comment</button>
        </form>
        <ul>
          {blog.comments.map((comment) => (
            <li key={comment.id}>{comment.content}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default BlogView

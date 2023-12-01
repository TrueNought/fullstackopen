import { useState } from 'react'

const BlogForm = ({ addBlog }) => {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')

  const handleCreate = (event) => {
    event.preventDefault()
    addBlog({
      url: url,
      title: title,
      author: author,
    })
    setUrl('')
    setTitle('')
    setAuthor('')
  }

  return (
    <>
      <h2>Create New</h2>
      
      <form onSubmit={handleCreate}>
        <div>
          url:
          <input name="url" value={url} onChange={event => setUrl(event.target.value)} />
        </div>
        <div>
          title:
          <input name="title" value={title} onChange={event => setTitle(event.target.value)} />
        </div>
        <div>
          author:
          <input name="author" value={author} onChange={event => setAuthor(event.target.value)} />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  )
}

export default BlogForm
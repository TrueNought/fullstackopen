import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')

    if (loggedUserJSON) {
      setUser(JSON.parse(loggedUserJSON))
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
      console.log('Successfully logged in with', username, password)
    } catch (error) {
      console.error('Wrong credentials')
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const handleCreate = async (event) => {
    event.preventDefault()

    const newBlog = {
      url: url,
      title: title,
      author: author,
    }
    
    try {
      const returnedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(returnedBlog))
      setUrl('')
      setTitle('')
      setAuthor('')
    } catch (error) {
      console.log(error.response.data.error)
    }
  } 

  const loginForm = () => (
    <>
      <h2>Please enter your credentials</h2>
      <form onSubmit={handleLogin}>
        <div>
          username: 
          <input name="Username" value={username} onChange={( {target} ) => setUsername(target.value)} />
        </div>
        <div>
          password:
          <input name="Pasword" value={password} onChange={( {target} ) => setPassword(target.value)} />
        </div>
        <button type="submit">login</button>
      </form>
    </>
  )

  const blogForm = () => (
    <>
      <h2>Blog List</h2>
      <div>
        {user.name} logged in
        <button type="submit" onClick={handleLogout}>logout</button>
      </div>
      <br></br>
      
      <h2>Create New</h2>
      
      <form onSubmit={handleCreate}>
        <div>
          url:
          <input name="Url" value={url} onChange={( {target} ) => setUrl(target.value)} />
        </div>
        <div>
          title:
          <input name="Title" value={title} onChange={( {target} ) => setTitle(target.value)} />
        </div>
        <div>
          author:
          <input name="Author" value={author} onChange={( {target} ) => setAuthor(target.value)} />
        </div>
        <button type="submit">create</button>
      </form>
      <br></br>
      
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </>
  )
  
  return (
    <div>
      {user === null 
        ? loginForm() 
        : blogForm()}      
    </div>
  )
}

export default App
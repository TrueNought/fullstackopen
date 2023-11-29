import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Statusbar from './components/Statusbar'
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
  const [message, setMessage] = useState(null)
  const [success, setSuccess] = useState(false)

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
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
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
      setSuccess(true)
      setMessage('Login successful')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      console.log('Successfully logged in with', username, password)
    } catch (error) {
      setSuccess(false)
      setMessage('Wrong username or password')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      console.error('Wrong credentials')
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedUser')
    setUser(null)
    setSuccess(true)
    setMessage('Logged out')
    setTimeout(() => {
      setMessage(null)
    }, 5000)
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
      setSuccess(true)
      setMessage(`${title} by ${author} has been added`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      setUrl('')
      setTitle('')
      setAuthor('')
    } catch (error) {
      setMessage(error.response.data.error)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  } 

  const loginForm = () => (
    <>
      <h2>Please enter your credentials</h2>
      <Statusbar message={message} success={success} />
      <form onSubmit={handleLogin}>
        <div>
          username: 
          <input name="username" value={username} onChange={( {target} ) => setUsername(target.value)} />
        </div>
        <div>
          password:
          <input name="pasword" value={password} onChange={( {target} ) => setPassword(target.value)} />
        </div>
        <button type="submit">login</button>
      </form>
    </>
  )

  const blogForm = () => (
    <>
      <h2>Blog List</h2>
      <Statusbar message={message} success={success} />
      <div>
        {user.name} logged in
        <button type="submit" onClick={handleLogout}>logout</button>
      </div>
      <br></br>
      
      <h2>Create New</h2>
      
      <form onSubmit={handleCreate}>
        <div>
          url:
          <input name="url" value={url} onChange={( {target} ) => setUrl(target.value)} />
        </div>
        <div>
          title:
          <input name="title" value={title} onChange={( {target} ) => setTitle(target.value)} />
        </div>
        <div>
          author:
          <input name="author" value={author} onChange={( {target} ) => setAuthor(target.value)} />
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
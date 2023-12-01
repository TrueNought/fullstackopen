import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Title from './components/Title'
import BlogForm from './components/BlogForm'
import StatusBar from './components/StatusBar'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
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
    window.localStorage.removeItem('loggedUser')
    setUser(null)
    setSuccess(true)
    setMessage('Logged out')
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const handleCreate = async (newBlog) => {
    try {
      const returnedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(returnedBlog))
      setSuccess(true)
      setMessage(`${title} by ${author} has been added`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (error) {
      setSuccess(false)
      setMessage(error.response.data.error)
      console.log('bruh')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  } 

  const loginForm = () => (
    <>
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

  const blogFormRef = useRef()

  const blogForm = () => {
    return (
      <>
        <div>
          {user.name} logged in
          <button type="submit" onClick={handleLogout}>logout</button>
        </div><br />
        
        <Togglable buttonLabel='new blog' ref={blogFormRef}>
          <BlogForm addBlog={handleCreate} />
        </Togglable><br />

        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </>
    )
  }
  
  return (
    <div>
      <Title user={user} />
      <StatusBar message={message} success={success} />
      {user === null 
        ? loginForm() 
        : blogForm()}      
    </div>
  )
}

export default App
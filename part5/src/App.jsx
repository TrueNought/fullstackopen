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

  const handleLogout = () => {
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
      blogFormRef.current.toggleVisibility()
      await blogService.create(newBlog)
      const blogs = await blogService.getAll()
      setBlogs(blogs)
      setSuccess(true)
      setMessage(`${newBlog.title} by ${newBlog.author} has been added`)
      console.log(blogs)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (error) {
      setSuccess(false)
      setMessage(error.response.data.error)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLike = async (id) => {
    try {
      const blog = blogs.find(blogs => blogs.id === id)
      const updatedBlog = { ...blog, likes: blog.likes + 1 }
      await blogService.update(updatedBlog.id, updatedBlog)
      setBlogs(blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b))
    } catch (error) {
      console.log(error.response.data.error)
    }
  }

  const handleDelete = async (id) => {
    try {
      const deletedBlog = blogs.find(blogs => blogs.id === id)
      if (window.confirm(`Remove ${deletedBlog.title} by ${deletedBlog.author}?`)) {
        await blogService.del(deletedBlog.id)
        setSuccess(true)
        setBlogs(blogs.filter(b => b.id !== deletedBlog.id))
        setMessage(`${deletedBlog.title} has been removed`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      }
    } catch (error) {
      console.log(error.response.data.error)
    }
  }

  const loginForm = () => (
    <>
      <form onSubmit={handleLogin}>
        <div>
          username:
          <input name='username' id='username' value={username} onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
          password:
          <input name='password' id='password' value={password} onChange={({ target }) => setPassword(target.value)} />
        </div>
        <button id='login-button' type='submit'>login</button>
      </form>
    </>
  )

  const blogFormRef = useRef()

  const blogForm = () => {
    return (
      <>
        <div>
          {`${user.name} logged in `}
          <button id='logout-button' type='submit' onClick={handleLogout}>logout</button>
        </div><br />

        <Togglable buttonLabel='new blog' ref={blogFormRef}>
          <BlogForm addBlog={handleCreate} />
        </Togglable><br />

        {blogs.sort((a,b) => b.likes - a.likes).map(blog =>
          <Blog key={blog.id} blog={blog} user={user} handleLike={() => handleLike(blog.id)} handleDelete={() => handleDelete(blog.id)} />
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
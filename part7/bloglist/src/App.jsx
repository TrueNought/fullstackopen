import { useState, useEffect, useRef, useReducer } from 'react'
import Blog from './components/Blog'
import Title from './components/Title'
import BlogForm from './components/BlogForm'
import StatusBar from './components/StatusBar'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import { useNotificationDispatch } from './components/NotificationContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const userReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return action.info
    case 'LOGOUT':
      return null
    default:
      return state
  }
}

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, userDispatch] = useReducer(userReducer, null)
  const notificationDispatch = useNotificationDispatch()
  const queryClient = useQueryClient()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({ type: 'LOGIN', info: user })
      blogService.setToken(user.token)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  const handleNotification = (options) => {
    notificationDispatch(options)
    setTimeout(() => {
      notificationDispatch({ type: 'CLEAR' })
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      userDispatch({ type: 'LOGIN', info: user })
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
      handleNotification({ type: 'LOGIN_SUCCESS' })
    } catch (error) {
      handleNotification({ type: 'LOGIN_FAIL' })
      console.error('Wrong credentials')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    userDispatch({ type: 'LOGOUT' })
    handleNotification({ type: 'LOGOUT' })
  }

  const updateBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
    onError: (error) => {
      handleNotification({ type: 'ERROR', error: error.response.data.error })
    },
  })

  const createBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      handleNotification({
        type: 'CREATE',
        title: newBlog.title,
        author: newBlog.author,
      })
    },
    onError: (error) => {
      handleNotification({ type: 'ERROR', error: error.response.data.error })
    },
  })

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.del,
    onSuccess: (_, deletedBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      handleNotification({ type: 'DELETE', title: deletedBlog.title })
    },
    onError: (error) => {
      handleNotification({ type: 'ERROR', error: error.response.data.error })
    },
  })

  const handleCreate = (newBlog) => {
    createBlogMutation.mutate(newBlog)
  }

  const handleLike = (blog) => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    updateBlogMutation.mutate(updatedBlog)
  }

  const handleDelete = (deletedBlog) => {
    if (
      window.confirm(`Remove ${deletedBlog.title} by ${deletedBlog.author}?`)
    ) {
      deleteBlogMutation.mutate(deletedBlog)
    }
  }

  const loginForm = () => (
    <>
      <form onSubmit={handleLogin}>
        <div>
          username:
          <input
            name="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password:
          <input
            name="pasword"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
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
          {`${user.name} logged in `}
          <button type="submit" onClick={handleLogout}>
            logout
          </button>
        </div>
        <br />

        <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <BlogForm addBlog={handleCreate} />
        </Togglable>
        <br />

        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              user={user}
              handleLike={() => handleLike(blog)}
              handleDelete={() => handleDelete(blog)}
            />
          ))}
      </>
    )
  }
  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const blogs = result.data

  return (
    <div>
      <Title user={user} />
      <StatusBar />
      {user === null ? loginForm() : blogForm()}
    </div>
  )
}

export default App

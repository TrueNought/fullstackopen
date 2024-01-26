import { useState, useEffect, useRef, useReducer } from 'react'
import BlogList from './components/BlogList'
import StatusBar from './components/StatusBar'
import BlogView from './components/BlogView'
import UserList from './components/UserList'
import UserView from './components/UserView'
import NavBar from './components/NavBar'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import { useNotificationDispatch } from './components/NotificationContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMatch, Route, Routes, useNavigate } from 'react-router-dom'

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
  const userMatch = useMatch('/users/:id')
  const blogMatch = useMatch('/blogs/:id')
  const navigate = useNavigate()
  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({ type: 'LOGIN', info: user })
      blogService.setToken(user.token)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const blogsQuery = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  })

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

  const createCommentMutation = useMutation({
    mutationFn: blogService.createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  const handleNotification = (type) => {
    notificationDispatch(type)
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
      navigate('/')
    }
  }

  const handleComment = (id, comment) => {
    const newComment = { content: comment, blog: id }
    createCommentMutation.mutate(newComment)
  }

  const login = () => {
    return (
      <div>
        <h2>Please enter your credentials</h2>
        <StatusBar />
        <form onSubmit={handleLogin}>
          <div>
            username:
            <input
              name="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>
          <div>
            password:
            <input
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  if (blogsQuery.isLoading || usersQuery.isLoading) {
    return <div>loading data...</div>
  }

  if (blogsQuery.isError || usersQuery.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const users = usersQuery.data
  const userInfo = userMatch
    ? users.find((user) => user.id === userMatch.params.id)
    : null

  const blogs = blogsQuery.data
  const blogInfo = blogMatch
    ? blogs.find((blog) => blog.id === blogMatch.params.id)
    : null

  if (!user) {
    return login()
  }

  return (
    <div>
      <NavBar username={user.name} handleLogout={handleLogout} />
      <h2>Blog App</h2>
      <StatusBar />
      <div>
        <Routes>
          <Route path="/users/:id" element={<UserView user={userInfo} />} />
          <Route path="/users" element={<UserList users={users} />} />
          <Route
            path="/blogs/:id"
            element={
              <BlogView
                blog={blogInfo}
                user={user}
                handleLike={() => handleLike(blogInfo)}
                handleDelete={() => handleDelete(blogInfo)}
                handleComment={handleComment}
              />
            }
          />
          <Route
            path="/"
            element={
              <BlogList
                blogs={blogsQuery.data}
                blogFormRef={blogFormRef}
                handleCreate={handleCreate}
              />
            }
          />
        </Routes>
      </div>
    </div>
  )
}

export default App

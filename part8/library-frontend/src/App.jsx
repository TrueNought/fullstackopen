import { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recs from './components/Recs'
import { useApolloClient } from '@apollo/client'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  useEffect(() => {
    const userToken = localStorage.getItem('userToken')
    if (userToken) {
      setToken(userToken)
    }
  }, [])

  const handleLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore
    setPage('authors')
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {!token && <button onClick={() => setPage('login')}>login</button>}
        {token && <button onClick={() => setPage('recs')}>recommend</button>}
        {token && <button onClick={handleLogout}>logout</button>}
      </div>

      {page === 'authors' && <Authors />}
      {page === 'books' && <Books />}
      {page === 'login' && <LoginForm setToken={setToken} setPage={setPage} />}
      {page === 'add' && <NewBook />}
      {page === 'recs' && <Recs />}
    </div>
  )
}

export default App
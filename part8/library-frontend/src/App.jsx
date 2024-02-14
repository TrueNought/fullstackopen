import { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recs from './components/Recs'
import { useApolloClient, useQuery, useSubscription } from '@apollo/client'
import { ALL_BOOKS, BOOK_ADDED } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const result = useQuery(ALL_BOOKS)
  const client = useApolloClient()

  useEffect(() => {
    const userToken = localStorage.getItem('userToken')
    if (userToken) {
      setToken(userToken)
    }
  }, [])

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const newBook = data.data.bookAdded
      alert(`New book ${newBook.title} has been added`)
      client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(newBook)
        }
      })
    }
  })

  const handleLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore
    setPage('authors')
  }

  if (result.loading) {
    return null
  }

  const books = result.data.allBooks
  let genres = new Set()
  books.forEach(b => {
    b.genres.forEach(g => {
      genres.add(g)
    })
  })
  genres.add('all genres')
  genres = Array.from(genres)

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
      {page === 'books' && <Books genres={genres} />}
      {page === 'login' && <LoginForm setToken={setToken} setPage={setPage} />}
      {page === 'add' && <NewBook />}
      {page === 'recs' && <Recs books={books} />}
    </div>
  )
}

export default App
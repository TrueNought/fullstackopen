import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = () => {
  const result = useQuery(ALL_BOOKS)
  const [filter, setFilter] = useState('all genres')

  if (result.loading) {
    return null
  }

  const books = result.data.allBooks
  
  let genres = new Set()
  books.forEach(book => {
    book.genres.forEach(genre => {
      genres.add(genre)
    })
  })
  genres.add('all genres')
  genres = Array.from(genres)

  const handleFilter = (genre) => {
    setFilter(genre)
  }

  const filteredBooks = filter === 'all genres'
    ? books
    : books.filter(book => book.genres.includes(filter))

  return (
    <div>
      <h2>books</h2>
      <p>in genre <strong>{filter}</strong></p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map(b => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map(g => (
          <button key={g} onClick={() => handleFilter(g)}>{g}</button>
        ))}
      </div>
    </div>
  )
}

export default Books
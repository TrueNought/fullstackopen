import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = ({ genres }) => {
  const result = useQuery(ALL_BOOKS)
  const [filter, setFilter] = useState('all genres')

  if (result.loading) {
    return null
  }

  const books = result.data.allBooks
  
  const handleFilter = (genre) => {
    setFilter(genre)
    if (genre === 'all genres') {
      result.refetch({ genre: null })
    } else {
      result.refetch({ genre: genre })
    }
  }

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
          {books.map(b => (
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
import { useQuery } from '@apollo/client'
import { USER } from '../queries'

const Recs = ({ books }) => {
  const genre = useQuery(USER)

  if (genre.loading) {
    return null
  }

  const favoriteGenre = genre.data.me.favoriteGenre
  const recBooks = books.filter(b => b.genres.includes(favoriteGenre))

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favourite genre <strong>{favoriteGenre}</strong></p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {recBooks.map(b => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recs
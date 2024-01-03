import { useSelector, useDispatch } from 'react-redux'
import { upvoteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)

  const filtered = filter === ''
    ? [...anecdotes]
    : anecdotes.filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))

  const handleVote = (anecdote) => {
    dispatch(upvoteAnecdote(anecdote))
    dispatch(setNotification(`You voted ${anecdote.content}`, 5))
  }

  return (
    <div>
      {filtered.sort((a, b) => b.votes - a.votes).map(anecdote =>
      <div key={anecdote.id}>
        <div>
          {anecdote.content}
        </div>
        <div>
          has {anecdote.votes}
          <button onClick={() => handleVote(anecdote)}>vote</button>
        </div>
      </div>
    )}
    </div>
  )
}

export default AnecdoteList
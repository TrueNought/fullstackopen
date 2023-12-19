import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { addNotification, removeNotification } from '../reducers/notificationReducer'
import { useState } from 'react'

const AnecdoteList = () => {
  const [notificationTimeout, setNotificationTimeout] = useState(null)
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)
  
  const filtered = filter === ''
    ? [...anecdotes]
    : anecdotes.filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))

  const handleVote = (anecdote) => {
    dispatch(voteAnecdote(anecdote.id))
    dispatch(addNotification(`You voted ${anecdote.content}`))
    if (notificationTimeout) {
      clearTimeout(notificationTimeout)
    }
    setNotificationTimeout(setTimeout(() => {
      dispatch(removeNotification())
    }, 5000))
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
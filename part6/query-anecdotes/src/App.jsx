import { useReducer } from 'react'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAll, update } from './services/requests'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import NotificationContext from './components/CounterContext'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'create':
      return `anecdote '${action.content}' created`
    case 'vote':
      return `anecdote '${action.content}' voted`
    case 'clear':
      return null
    default:
      return state
  }
}

const App = () => {
  const queryClient = useQueryClient()
  const [notification, notificationDispatch] = useReducer(notificationReducer, null)

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAll,
    retry: 1,
  })

  const updateAnecdoteMutation = useMutation({
    mutationFn: update,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['anecdotes']})
  })

  const handleVote = (anecdote) => {
    const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1}
    updateAnecdoteMutation.mutate(updatedAnecdote)
    notificationDispatch({ type: 'vote', content: anecdote.content})
    setTimeout(() => {
      notificationDispatch({ type: 'clear' })
    }, 5000)
  }

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      <h3>Anecdote App</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
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
    </NotificationContext.Provider>
  )
}

export default App

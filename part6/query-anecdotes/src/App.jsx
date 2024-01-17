import { useContext } from 'react'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAll, update } from './services/requests'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNotificationDispatch } from './components/CounterContext'

const App = () => {
  const queryClient = useQueryClient()
  const notificationDispatch = useNotificationDispatch()

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
    <div>
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
    </div>
  )
}

export default App

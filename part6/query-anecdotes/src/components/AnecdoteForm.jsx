import { useMutation, useQueryClient } from '@tanstack/react-query'
import { create } from '../services/requests'
import { useContext } from "react"
import NotificationContext from "./CounterContext"

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const [notification, notificationDispatch] = useContext(NotificationContext)

  const newAnecdoteMutation = useMutation({ 
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
    onError: (error) => {
      notificationDispatch({ type: 'error', content: error.response.data.error })
      setTimeout(() => {
        notificationDispatch({ type: 'clear' })
      }, 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
    notificationDispatch({ type: 'create', content: content })
    setTimeout(() => {
      notificationDispatch({ type: 'clear' })
    }, 5000)
  }

  return (
    <div>
      <h3>Create New</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm

import { createSlice } from '@reduxjs/toolkit'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteAnecdote(state, action) {
      const id = action.payload
      const curr = state.find(anecdote => anecdote.id === id)
      const changed = {
        ...curr,
        votes: curr.votes += 1
      }
      state.map(anecdote => anecdote.id === id ? changed : anecdote)
    },
    createAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdote(state, action) {
      return action.payload
    }
  }
})

export const { voteAnecdote, createAnecdote, setAnecdote } = anecdoteSlice.actions
export default anecdoteSlice.reducer
import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (content) => {
  const newObj = { content, votes: 0 }
  const response = await axios.post(baseUrl, newObj)
  return response.data
}

const update = async (anecdote) => {
  const newObj = {...anecdote, votes: anecdote.votes + 1 }
  const response = await axios.put(`${baseUrl}/${anecdote.id}`, newObj)
  return response.data
}

export default { getAll, create, update }
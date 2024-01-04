import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAll = () => 
  axios.get(baseUrl).then(res => res.data)

export const create = (newObj) =>
  axios.post(baseUrl, newObj).then(res => res.data)
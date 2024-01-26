import axios from 'axios'
const baseUrl = 'http://localhost:3002/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (newObject) => {
  const response = await axios.put(`${baseUrl}/${newObject.id}`, newObject)
  return response.data
}

const del = async (deletedObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.delete(`${baseUrl}/${deletedObject.id}`, config)
  return response
}

const createComment = async(newComment) => {
  const response = await axios.post(`${baseUrl}/${newComment.blog}/comments`, newComment)
  return response.data
}

export default {
  getAll,
  create,
  update,
  del,
  setToken,
  createComment,
}

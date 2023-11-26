const logger =  require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformmated id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: error.message })
  }

  next(error)
}

const userExtractor = async (request, response, next) => {
  const authorization = request.get('authorization')
  const token = authorization && authorization.startsWith('Bearer ')
    ? authorization.replace('Bearer ', '')
    : null

  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!decodedToken.id) {
    response.status(401).json({ error: 'Invalid Token' })
  }
  request.user = await User.findById(decodedToken.id)
  next()
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  userExtractor,
}
const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  url: {
    type: String,
    validate: {
      validator: (v) => {
        return /^(ftp|http|https):\/\/[^ "]+$/.test(v)
      },
      message: '{VALUE} is not a valid link',
    },
    required: true,
  },
  title: {
    type: String,
    minLength: 3,
    required: true,
  },
  author: {
    type: String,
    minLength: 1,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  likes: {
    type: Number,
    default: 0,
  },
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Blog', blogSchema)
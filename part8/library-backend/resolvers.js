const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args) {
        return Book.find({}).populate('author')
      }
      let query = {}
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (!author) {
          return []
        }
        query.author = author._id
      }
      if (args.genre) {
        query.genres = args.genre
      }
      return Book.find(query).populate('author')
    },
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => context.currentUser,
  },

  Author: {
    bookCount: async (root) => {
      let author = await Author.findOne({ name: root.name })
      if (!author) {
        return 0
      }
      return Book.countDocuments({ author: author._id })
    },
  },

  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }
      if (args.title.length < 5) {
        throw new GraphQLError('Title must be at least 5 characters long', {
          extensions: {
            code: 'GRAPHQL_VALIDATION_FAILED',
            invalidArgs: args.title,
          },
        })
      }
      let author = await Author.findOne({ name: args.author })
      if (!author) {
        if (args.author.length < 5) {
          throw new GraphQLError('Author must be at least 4 characters long', {
            extensions: {
              code: 'GRAPHQL_VALIDATION_FAILED',
              invalidArgs: args.author,
            },
          })
        }
        author = new Author({ name: args.author })
        await author.save()
      }
      const newBook = new Book({ ...args, author: author })
      await newBook.save()

      pubsub.publish('BOOK_ADDED', { bookAdded: newBook })

      return newBook
    },

    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }
      const updatedAuthor = await Author.findOneAndUpdate(
        { name: args.name },
        { born: args.setBornTo },
        { new: true },
      )
      return updatedAuthor
    },

    createUser: async(root, args) => {
      if (args.username.length < 3) {
        throw new GraphQLError('Username must be at least 3 characters long', {
          extensions: {
            code: 'GRAPHQL_VALIDATION_FAILED',
            invalidArgs: args.username,
          },
        })
      }
      const user = new User({ ...args })
      return user.save()
    },

    login: async(root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'test') {
        throw new GraphQLError('Wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      const userToken = {
        username: user.username,
        id: user._id,
      }
      return { value: jwt.sign(userToken, process.env.SECRET) }
    },
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED'),
    },
  },
}

module.exports = resolvers
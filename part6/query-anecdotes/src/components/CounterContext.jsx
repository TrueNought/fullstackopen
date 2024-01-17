import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'create':
      return `anecdote '${action.content}' created`
    case 'vote':
      return `anecdote '${action.content}' voted`
    case 'error':
      return `${action.content}`
    case 'clear':
      return null
    default:
      return state
  }
}

const NotificationContext = createContext()

/* eslint-disable react-refresh/only-export-components */
export const useNotificationValue = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[1]
}

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, null)

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch] }>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext
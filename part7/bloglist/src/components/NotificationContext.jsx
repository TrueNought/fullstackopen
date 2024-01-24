import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return 'Login successful'
    case 'LOGIN_FAIL':
      return 'Wrong username or password'
    case 'LOGOUT':
      return 'Logged out'
    case 'CREATE':
      return `${action.title} by ${action.author} has been added`
    case 'DELETE':
      return `${action.title} has been removed`
    case 'ERROR':
      return `${action.error}`
    case 'CLEAR':
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
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext
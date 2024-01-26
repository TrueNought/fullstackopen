import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { message: 'Login successful', success: true }
    case 'LOGIN_FAIL':
      return { message: 'Wrong username or password', success: false }
    case 'LOGOUT':
      return { message: 'Logged out', success: true }
    case 'CREATE':
      return {
        message: `${action.title} by ${action.author} has been added`,
        success: true,
      }
    case 'DELETE':
      return { message: `${action.title} has been removed`, success: true }
    case 'ERROR':
      return { message: `${action.error}`, success: false }
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
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    null,
  )

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext

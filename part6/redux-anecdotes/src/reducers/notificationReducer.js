/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    addNotification(state, action) {
      return action.payload
    },
    removeNotification(state, action) {
      return null
    }
  }
})

export const { addNotification, removeNotification } = notificationSlice.actions

let notificationTimeout

export const setNotification = (message, time) => {
  return (dispatch) => {
    dispatch(addNotification(message))

    if (notificationTimeout) {
      clearTimeout(notificationTimeout)
    }

    notificationTimeout = setTimeout(() => {
      dispatch(removeNotification())
      notificationTimeout = null
    }, time * 1000)
  }
}

export default notificationSlice.reducer
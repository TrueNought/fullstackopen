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
export default notificationSlice.reducer
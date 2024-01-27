import { useNotificationValue } from './NotificationContext'
import { Alert } from '@mui/material'

const StatusBar = () => {
  const notification = useNotificationValue()

  if (!notification) {
    return null
  }
  if (notification.success) {
    return <Alert severity="success">{notification.message}</Alert>
  } else {
    return <Alert severity="error">{notification.message}</Alert>
  }
}

export default StatusBar

import { useNotificationValue } from './NotificationContext'

const StatusBar = () => {
  const notification = useNotificationValue()

  if (!notification) {
    return null
  }
  if (notification.success) {
    return <div className="success">{notification.message}</div>
  } else {
    return <div className="error">{notification.message}</div>
  }
}

export default StatusBar

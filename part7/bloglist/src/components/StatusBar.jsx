import { useNotificationValue } from './NotificationContext'

const StatusBar = ({ success }) => {
  const notification = useNotificationValue()
  if (!notification) {
    return null
  }

  if (success) {
    return <div className="success">{notification}</div>
  } else {
    return <div className="error">{notification}</div>
  }
}

export default StatusBar

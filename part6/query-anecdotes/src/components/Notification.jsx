import { useContext } from "react"
import NotificationContext from "./CounterContext"

const Notification = () => {
  const [notification, notificationDispatch] = useContext(NotificationContext)
  
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }
  
  if (!notification) {
    return null
  }
  
  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification

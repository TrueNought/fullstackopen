const StatusBar = ({ message, success }) => {
  if (!message) {
    return null
  } 

  if (success) {
    return (
      <div className="success"> 
        {message}
      </div>
    )
  } else {
    return (
      <div className ="error">
        {message}
      </div>
    )
  }
}

export default StatusBar
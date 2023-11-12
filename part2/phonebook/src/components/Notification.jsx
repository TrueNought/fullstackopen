const Notification = ({ message, isSuccess }) => {
  if (message === null) {
    return null
  } else if (isSuccess) {
    return (
      <div className='success'>
        {message}
      </div>
    )
  } else {
    return (
      <div className='error'>
        {message}
      </div>
    )
  }
}

export default Notification
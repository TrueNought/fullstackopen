const Title = ({ user }) => {
  if (!user) {
    return (<h2>Please enter your credentials</h2>)
  } else {
    return (<h2>Blog List</h2>)
  }
}

export default Title
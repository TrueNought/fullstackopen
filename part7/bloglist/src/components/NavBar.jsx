import { Link } from 'react-router-dom'

const nav = {
  padding: 5,
}

const NavBar = ({ username, handleLogout }) => {
  return (
    <div style={{ backgroundColor: 'lightGray' }}>
      <Link style={nav} to="/">
        Blogs
      </Link>
      <Link style={nav} to="/users">
        Users
      </Link>
      {`${username} logged in `}
      <button type="submit" onClick={handleLogout}>
        logout
      </button>
    </div>
  )
}

export default NavBar

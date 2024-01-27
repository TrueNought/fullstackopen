import { Link } from 'react-router-dom'
import { AppBar, Toolbar, Button, Typography } from '@mui/material'

const NavBar = ({ username, handleLogout }) => {
  return (
    <AppBar position="static" color="default" elevation={0} style={{ borderBottom: '1px solid #e0e0e0' }}>
      <Toolbar style={{ display: 'flex', justifyContent: 'space-between', padding: '0' }}>
        <nav>
          <Link
            color="text.primary"
            to="/"
            style={{ margin: '8px' }}
          >
            Blogs
          </Link>
          <Link
            color="text.primary"
            to="/users"
            style={{ margin: '8px' }}
          >
            Users
          </Link>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography color="inherit" noWrap style={{ margin: '8px' }}>
            {`${username} logged in`}
          </Typography>
          <Button onClick={handleLogout} variant="outlined" style={{ margin: '8px' }}>
            Logout
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default NavBar

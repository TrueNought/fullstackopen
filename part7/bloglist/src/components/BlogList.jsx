import Togglable from './Togglable'
import BlogForm from './BlogForm'
import { Link } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material'

const BlogList = ({ blogs, blogFormRef, handleCreate }) => {
  return (
    <div>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm addBlog={handleCreate} />
      </Togglable>
      <br />

      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableBody>
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <TableRow key={blog.id}>
                <TableCell>
                  <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                </TableCell>
                <TableCell>
                  {blog.author}
                </TableCell>
              </TableRow>
          ))}
        </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default BlogList

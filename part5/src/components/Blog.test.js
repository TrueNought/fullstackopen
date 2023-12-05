import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    url: 'https://test.com',
    title: 'Blog Test',
    author: 'Tester',
    id: '12345',
    user: {
      'name': 'Roland',
      'username': 'roro',
      'id': '100',
    },
    likes: 3,
  }

  let container
  const mockLikeHandler = jest.fn()

  beforeEach(() => {
    container = render(
      <Blog blog={blog} user={blog.user} handleLike={mockLikeHandler} />
    ).container
  })

  test('renders title and author but not url or likes by default', () => {
    const titleElement = screen.queryByText(blog.title)
    const authorElement = screen.queryByText(blog.author)
    const urlElement = screen.queryByText(blog.url)
    const likesElement = screen.queryByText(blog.likes)

    expect(titleElement).toBeDefined()
    expect(authorElement).toBeDefined()
    expect(urlElement).toBeNull()
    expect(likesElement).toBeNull()
  })

  test('url and likes are shown when button is clicked', async () => {
    const user = userEvent.setup()
    const button = container.querySelector('.visibilityToggle')
    await user.click(button)

    const urlElement = screen.queryByText(blog.url)
    const likesElement = screen.queryByText(blog.likes)
    expect(urlElement).toBeDefined()
    expect(likesElement).toBeDefined()
  })

  test('when like button is clicked twice, the event handler is called twice', async () => {
    const user = userEvent.setup()
    const viewButton = container.querySelector('.visibilityToggle')
    await user.click(viewButton)

    const likeButton = container.querySelector('.likeButton')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockLikeHandler.mock.calls).toHaveLength(2)
  })
})
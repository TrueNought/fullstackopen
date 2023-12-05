import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('blog creation calls event handler with correct details', async () => {
    const mockCreateHandler = jest.fn()
    const user = userEvent.setup()

    const container = render(<BlogForm addBlog={mockCreateHandler} />).container

    const url = container.querySelector('#url')
    const title = container.querySelector('#title')
    const author = container.querySelector('#author')
    const sendButton = screen.getByText('create')

    await user.type(url, 'https://new.com')
    await user.type(title, 'Newly Added Blog')
    await user.type(author, 'Newbie')
    await user.click(sendButton)

    console.log(mockCreateHandler.mock.calls[0][0])
    expect(mockCreateHandler.mock.calls).toHaveLength(1)
    expect(mockCreateHandler.mock.calls[0][0]).toEqual({
      url: 'https://new.com',
      title: 'Newly Added Blog',
      author: 'Newbie',
    })
  })
})
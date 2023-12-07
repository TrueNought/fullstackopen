Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3002/api/login', {
    username, password,
  }).then(({ body }) => {
    localStorage.setItem('loggedUser', JSON.stringify(body))
    cy.visit('http://localhost:5173')
  })
})

Cypress.Commands.add('createBlog', ({ url, title, author }) => {
  cy.request({
    url: 'http://localhost:3002/api/blogs',
    method: 'POST',
    body: { url, title, author },
    headers: {
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedUser')).token}`,
    },
  })
  cy.visit('http://localhost:5173')
})
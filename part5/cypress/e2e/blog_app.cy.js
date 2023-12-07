describe('Blog app', function () {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3002/api/testing/reset')
    const user = {
      name: 'Tester',
      username: 'test',
      password: 'test',
    }
    cy.request('POST', 'http://localhost:3002/api/users/', user)
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown by default', function() {
    cy.contains('Please enter your credentials')
    cy.get('#login-button').should('exist')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('test')
      cy.get('#password').type('test')
      cy.get('#login-button')
        .should('exist')
        .click()
      cy.contains('Tester logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('test')
      cy.get('#password').type('wrong')
      cy.get('#login-button')
        .should('exist')
        .click()
      cy.contains('Wrong username or password')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'test', password: 'test' })
    })

    it('a new blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#url').type('https://newblog.com')
      cy.get('#title').type('First New Blog')
      cy.get('#author').type('Test Writer')
      cy.contains('create').click()

      cy.contains('has been added')
      cy.contains('First New Blog')
    })

    describe('and a blog exists', function() {
      beforeEach(function() {
        cy.createBlog({
          url: 'https://existingblog.com',
          title: 'I Am A Blog',
          author: 'Anonymous',
        })
      })

      it.only('a user can like that blog', function() {
        cy.contains('view').click()
        cy.contains('likes: 0')

        cy.contains('like').click()
        cy.contains('likes: 1')
      })
    })
  })
})
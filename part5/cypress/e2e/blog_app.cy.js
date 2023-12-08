describe('Blog app', function () {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Tester',
      username: 'test',
      password: 'test',
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
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

      it('a user can like that blog', function() {
        cy.contains('view').click()
        cy.contains('likes: 0')

        cy.contains('like').click()
        cy.contains('likes: 1')
      })

      it('the creator of that blog can delete it', function() {
        cy.contains('view').click()
        cy.contains('remove').click()

        cy.contains('I Am A Blog has been removed')
        cy.wait(5000)
        cy.get('html').should('not.contain', 'I Am A Blog')
      })

      it('only the creator can see the delete button of a blog', function() {
        const user = {
          name: 'Random',
          username: 'rando',
          password: 'rando',
        }
        cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)

        cy.contains('view').click()
        cy.contains('remove').should('exist')

        cy.login({ username: 'rando', password: 'rando' })
        cy.contains('view').click()
        cy.contains('remove').should('not.exist')
      })
    })

    describe('and multiple blogs exist', function() {
      beforeEach(function() {
        cy.createBlog({
          url: 'https://one.com',
          title: 'Blog One',
          author: 'Writer One',
        })
        cy.createBlog({
          url: 'https://two.com',
          title: 'Blog Two',
          author: 'Writer Two',
        })
        cy.createBlog({
          url: 'https://three.com',
          title: 'Blog Three',
          author: 'Writer Three',
        })
      })

      it('blogs are ordered by descending with number of likes', function() {
        cy.get('.visibilityToggle').each(($el) => {
          cy.wrap($el).click()
        })

        cy.contains('Blog Two').parent().contains('like').as('buttonTwo')
        cy.contains('Blog Three').parent().contains('like').as('buttonThree')

        cy.get('@buttonTwo').click()
        cy.get('@buttonThree').click()

        cy.contains('likes: 1').then(() => {
          cy.get('@buttonThree').click()
        })

        cy.get('.blog').eq(0).should('contain', 'Blog Three')
        cy.get('.blog').eq(1).should('contain', 'Blog Two')
        cy.get('.blog').eq(2).should('contain', 'Blog One')
      })
    })
  })
})
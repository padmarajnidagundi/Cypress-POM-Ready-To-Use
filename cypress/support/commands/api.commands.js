Cypress.Commands.add('apiLogin', (username, password) => {
    return cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/login`,
        body: {
            username,
            password
        }
    })
})

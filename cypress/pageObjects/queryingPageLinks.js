class queryingPageLinks {
    visit() {
        cy.visit('https://example.cypress.io/commands/querying')
    }

    getHeader() {
        return cy.get('h1')
    }

    getNavigationLink(linkText) {
        return cy.get('a').contains(linkText)
    }

    getQueryingSection() {
        return cy.get('#querying')
    }

    getQueryingExamples() {
        return cy.get('.query-btn')
    }
}

export default queryingPageLinks
import ChatGptPage from '../../pageObjects/chatGptPage'

describe('ChatGPT Accessibility Tests', () => {
    const chatGpt = new ChatGptPage()
    
    beforeEach(() => {
        // Store auth state to prevent login on every test
        cy.session('chatgpt_session', () => {
            chatGpt.visit()
            // Note: Add proper login steps here using env variables
            // cy.login(Cypress.env('CHATGPT_USER'), Cypress.env('CHATGPT_PASS'))
        })
    })

    it('should have no accessibility violations in the initial state', () => {
        chatGpt.visit()
        cy.checkA11y(null, {
            // Specify which rules to include/exclude
            rules: {
                'color-contrast': { enabled: true },
                'landmark-one-main': { enabled: true },
                'page-has-heading-one': { enabled: true },
                'scrollable-region-focusable': { enabled: true }
            }
        })
    })

    it('should maintain accessibility after sending a message', () => {
        chatGpt.visit()
        const testMessage = 'Test message for accessibility'
        
        chatGpt.sendMessage(testMessage)
        chatGpt.waitForResponse()
        
        // Check accessibility of the chat interface with messages
        cy.checkA11y('#chat-container', {
            rules: {
                'color-contrast': { enabled: true },
                'aria-hidden-focus': { enabled: true },
                'scrollable-region-focusable': { enabled: true }
            }
        })
    })

    it('should have accessible error messages', () => {
        chatGpt.visit()
        chatGpt.mockResponseFailure(500, 'Internal Server Error')
        
        chatGpt.sendMessage('Trigger error for accessibility test')
        cy.wait('@failedRequest')
        
        // Check accessibility of error messages
        cy.checkA11y('[data-testid="error-message"]', {
            rules: {
                'color-contrast': { enabled: true },
                'aria-alert': { enabled: true },
                'role-has-required-aria-props': { enabled: true }
            }
        })
    })

    it('should have accessible menu and settings', () => {
        chatGpt.visit()
        
        // Test menu accessibility
        chatGpt.openMenu()
        cy.checkA11y('[data-testid="menu"]', {
            rules: {
                'color-contrast': { enabled: true },
                'focus-trap': { enabled: true },
                'aria-hidden-focus': { enabled: true }
            }
        })
        
        // Test settings accessibility
        chatGpt.openSettings()
        cy.checkA11y('[data-testid="settings"]', {
            rules: {
                'color-contrast': { enabled: true },
                'focus-trap': { enabled: true },
                'aria-dialog': { enabled: true }
            }
        })
    })

    it('should have proper keyboard navigation', () => {
        chatGpt.visit()
        
        // Test tab navigation
        cy.get('body').tab()
        cy.focused().should('have.attr', 'data-testid', 'message-input')
        
        cy.get('body').tab()
        cy.focused().should('have.attr', 'data-testid', 'send-button')
        
        // Test keyboard interaction with menu
        cy.get(chatGpt.selectors.menuButton)
            .focus()
            .type('{enter}')
        cy.get('[data-testid="menu"]').should('be.visible')
        
        // Test escape key functionality
        cy.get('body').type('{esc}')
        cy.get('[data-testid="menu"]').should('not.exist')
    })

    it('should have accessible chat history navigation', () => {
        chatGpt.visit()
        
        // Send multiple messages to create chat history
        const messages = ['Message 1', 'Message 2']
        messages.forEach(msg => {
            chatGpt.sendMessage(msg)
            chatGpt.waitForResponse()
        })
        
        // Check accessibility of chat history
        cy.checkA11y('[data-testid="chat-history"]', {
            rules: {
                'color-contrast': { enabled: true },
                'scrollable-region-focusable': { enabled: true },
                'aria-required-children': { enabled: true },
                'list': { enabled: true }
            }
        })
        
        // Test keyboard navigation within chat history
        cy.get('[data-testid="chat-history"]')
            .focus()
            .type('{pagedown}')
            .type('{pageup}')
            .should('have.attr', 'aria-label')
    })
})

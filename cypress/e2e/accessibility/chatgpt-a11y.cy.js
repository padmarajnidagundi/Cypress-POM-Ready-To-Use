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

    it('should verify ARIA attributes on interactive elements', () => {
        chatGpt.visit()
        
        // Check message input accessibility
        chatGpt.checkElementAccessibility(chatGpt.selectors.messageInput, { tabIndex: '0' })
            .should('have.attr', 'aria-placeholder')
            .and('have.attr', 'aria-multiline', 'true')
        
        // Check send button accessibility
        chatGpt.checkElementAccessibility(chatGpt.selectors.sendButton)
            .should('have.attr', 'aria-pressed', 'false')
            .and('have.attr', 'role', 'button')
        
        // Check menu button accessibility
        chatGpt.checkElementAccessibility(chatGpt.selectors.menuButton)
            .should('have.attr', 'aria-haspopup', 'true')
            .and('have.attr', 'aria-controls')
    })

    it('should verify focus management in chat interface', () => {
        chatGpt.visit()
        const testMessage = 'Testing focus management'
        
        // Verify focus on input
        chatGpt.getElement(chatGpt.selectors.messageInput).focus()
        cy.focused().should('have.attr', 'data-testid', 'message-input')
        
        // Send message and verify focus retention
        chatGpt.sendMessage(testMessage)
        cy.focused().should('have.attr', 'data-testid', 'message-input')
        
        // Verify regenerate button is focusable after response
        chatGpt.waitForResponse()
        chatGpt.checkFocusableElement(chatGpt.selectors.regenerateButton)
            .focus()
        cy.focused().should('have.attr', 'data-testid', 'regenerate-button')
    })

    it('should verify dynamic ARIA updates', () => {
        chatGpt.visit()
        
        // Check menu button states
        chatGpt.verifyAriaExpanded(chatGpt.selectors.menuButton, false)
        chatGpt.openMenu()
        chatGpt.verifyAriaExpanded(chatGpt.selectors.menuButton, true)
        
        // Check loading state announcements
        chatGpt.sendMessage('Test message')
        cy.get('[role="status"]')
            .should('exist')
            .and('have.attr', 'aria-live', 'polite')
        
        // Verify response containers
        chatGpt.waitForResponse()
        cy.get('[role="log"]')
            .should('exist')
            .and('have.attr', 'aria-label')
            .and('not.be.empty')
    })

    it('should verify heading hierarchy and landmarks', () => {
        chatGpt.visit()
        
        // Check main landmark
        cy.get('main')
            .should('exist')
            .and('have.attr', 'role', 'main')
        
        // Verify heading levels
        cy.get('h1').should('exist').and('be.visible')
        cy.get('h2, h3, h4, h5, h6').each(($heading) => {
            const currentLevel = parseInt($heading.prop('tagName').slice(1))
            const parentHeadings = $heading.prevAll(':header')
            
            if (parentHeadings.length > 0) {
                const previousLevel = parseInt(parentHeadings.first().prop('tagName').slice(1))
                expect(currentLevel - previousLevel).to.be.lessThan(2)
            }
        })
    })

    it('should verify color contrast and text accessibility', () => {
        chatGpt.visit()
        
        // Custom contrast check function
        const checkContrast = ($el) => {
            const backgroundColor = $el.css('background-color')
            const color = $el.css('color')
            // Note: In a real implementation, you'd calculate the contrast ratio
            expect(backgroundColor).to.not.equal(color)
        }
        
        // Check interactive elements
        cy.get('button, a, input, [role="button"]').each(($el) => {
            checkContrast($el)
            
            // Check text size
            const fontSize = parseInt($el.css('font-size'))
            expect(fontSize).to.be.at.least(12)
        })
        
        // Check focus indicators
        cy.get('button').first().focus()
        cy.focused()
            .should('have.css', 'outline')
            .and('not.equal', 'none')
    })

    it('should verify keyboard shortcuts and help text', () => {
        chatGpt.visit()
        
        // Check for keyboard shortcut documentation
        cy.get('[aria-label*="keyboard shortcuts"], [aria-label*="help"]')
            .should('exist')
            .and('be.visible')
        
        // Verify common keyboard shortcuts
        const shortcuts = {
            '{esc}': () => cy.get('[data-testid="menu"]').should('not.be.visible'),
            '{ctrl}/': () => cy.get('[aria-label*="keyboard shortcuts"]').should('be.visible'),
            '{ctrl}k': () => cy.focused().should('have.attr', 'data-testid', 'message-input')
        }
        
        Object.entries(shortcuts).forEach(([key, assertion]) => {
            cy.get('body').type(key)
            assertion()
        })
    })
})

import ChatGptPage from '../../pageObjects/chatGptPage'

describe('ChatGPT UI Tests', () => {
    const chatGpt = new ChatGptPage()
    
    beforeEach(() => {
        // Store auth state to prevent login on every test
        cy.session('chatgpt_session', () => {
            chatGpt.visit()
            // Note: Add proper login steps here using env variables
            // cy.login(Cypress.env('CHATGPT_USER'), Cypress.env('CHATGPT_PASS'))
        })
    })

    it('should load the chat interface', () => {
        chatGpt.visit()
        chatGpt.getElement(chatGpt.selectors.messageInput).should('be.visible')
        chatGpt.getElement(chatGpt.selectors.sendButton).should('be.visible')
    })

    it('should send a message and receive a response', () => {
        chatGpt.visit()
        const testMessage = 'What is automated testing?'
        
        chatGpt.sendMessage(testMessage)
        chatGpt.waitForResponse()
        
        chatGpt.getLastResponse()
            .should('be.visible')
            .and('not.be.empty')
    })

    it('should maintain chat history', () => {
        chatGpt.visit()
        const messages = ['Hello', 'How are you?']
        
        messages.forEach(msg => {
            chatGpt.sendMessage(msg)
            chatGpt.waitForResponse()
        })

        chatGpt.getChatHistory()
            .should('contain', messages[0])
            .and('contain', messages[1])
    })

    it('should handle long conversations', () => {
        chatGpt.visit()
        const conversation = [
            'What is cypress?',
            'How does it compare to Selenium?',
            'What are the advantages of Cypress?'
        ]
        
        conversation.forEach(msg => {
            chatGpt.sendMessage(msg)
            chatGpt.waitForResponse()
            chatGpt.getLastResponse().should('be.visible')
        })
    })

    it('should open menu and settings', () => {
        chatGpt.visit()
        
        // Verify menu interaction
        chatGpt.getElement(chatGpt.selectors.menuButton)
            .should('be.visible')
            .click()
        
        // Verify settings button is visible in menu
        chatGpt.getElement(chatGpt.selectors.settingsButton)
            .should('be.visible')
            .click()
            
        // Add assertions for settings panel visibility
        // Note: Add proper settings panel selector when available
        cy.url().should('include', '/settings')
    })

    it('should verify complete message interaction flow', () => {
        chatGpt.visit()
        const testMessage = 'Tell me about Cypress testing'
        
        // Verify initial state
        chatGpt.getElement(chatGpt.selectors.clearButton).should('be.visible')
        chatGpt.getElement(chatGpt.selectors.messageInput)
            .should('be.visible')
            .and('be.empty')
            .and('have.attr', 'placeholder')
        
        // Send message and verify loading state
        chatGpt.sendMessage(testMessage)
        chatGpt.getElement(chatGpt.selectors.loadingIndicator)
            .should('be.visible')
        
        // Wait for and verify response
        chatGpt.waitForResponse()
        
        // Verify message appears in both user and assistant sections
        chatGpt.getUserMessages()
            .should('contain', testMessage)
        chatGpt.getAssistantMessages()
            .should('be.visible')
            .and('not.be.empty')
        
        // Verify regenerate button is available
        chatGpt.getElement(chatGpt.selectors.regenerateButton)
            .should('be.visible')
            .and('be.enabled')
        
        // Test regenerate functionality
        chatGpt.regenerateResponse()
        chatGpt.getElement(chatGpt.selectors.loadingIndicator)
            .should('be.visible')
        chatGpt.waitForResponse()
        
        // Clear conversation and verify
        chatGpt.clearConversation()
        chatGpt.getChatHistory()
            .should('not.contain', testMessage)
        chatGpt.getElement(chatGpt.selectors.messageInput)
            .should('be.empty')
    })

    describe('Error Handling', () => {
        beforeEach(() => {
            chatGpt.visit()
        })

        it('should handle network timeout gracefully', () => {
            chatGpt.mockResponseFailure(504, 'Gateway Timeout')
            const testMessage = 'This should trigger a timeout'
            
            chatGpt.sendMessage(testMessage)
            cy.wait('@failedRequest')
            
            chatGpt.getErrorMessage()
                .should('be.visible')
                .and('contain', 'timeout')
            
            // Verify UI remains functional
            chatGpt.getElement(chatGpt.selectors.messageInput)
                .should('be.enabled')
            chatGpt.getElement(chatGpt.selectors.sendButton)
                .should('be.enabled')
        })

        it('should handle server errors appropriately', () => {
            chatGpt.mockResponseFailure(500, 'Internal Server Error')
            const testMessage = 'This should trigger a server error'
            
            chatGpt.sendMessage(testMessage)
            cy.wait('@failedRequest')
            
            chatGpt.getErrorMessage()
                .should('be.visible')
                .and('contain', 'error')
            
            // Verify retry functionality
            chatGpt.getElement(chatGpt.selectors.regenerateButton)
                .should('be.visible')
                .and('be.enabled')
                .click()
            
            // Verify message persistence
            chatGpt.getUserMessages()
                .should('contain', testMessage)
        })

        it('should handle rate limiting', () => {
            chatGpt.mockResponseFailure(429, 'Too Many Requests')
            const testMessage = 'This should trigger rate limiting'
            
            chatGpt.sendMessage(testMessage)
            cy.wait('@failedRequest')
            
            chatGpt.getErrorMessage()
                .should('be.visible')
                .and('contain', 'rate limit')
            
            // Verify cool-down message
            cy.contains('Please wait before sending more messages')
                .should('be.visible')
            
            // Verify message input is temporarily disabled
            chatGpt.getElement(chatGpt.selectors.messageInput)
                .should('be.disabled')
        })
    })

    /**
     * Example: should not send an empty message
     */
    it('example: should not send an empty message', () => {
        chatGpt.visit()
        chatGpt.getElement(chatGpt.selectors.messageInput).clear()
        chatGpt.getElement(chatGpt.selectors.sendButton).click()
        // Expect an error or a no-op; tolerate both but surface an indicator if present
        cy.get('body').then(($body) => {
            if ($body.find('.error-message').length) {
                chatGpt.getErrorMessage().should('be.visible')
            } else {
                // no error element: ensure no new user message was added
                chatGpt.getUserMessages().should('not.contain', '')
            }
        })
    })

    /**
     * Example: should handle emoji input
     */
    it('example: should handle messages with emoji', () => {
        chatGpt.visit()
        const msg = 'Hello 😊'
        chatGpt.sendMessage(msg)
        chatGpt.waitForResponse()
        chatGpt.getAssistantMessages().should('be.visible').and('not.be.empty')
        chatGpt.getUserMessages().should('contain', 'Hello')
    })

    /**
     * Example: simulate paste into message input then send
     */
    it('example: should accept pasted text into input', () => {
        chatGpt.visit()
        const pasted = 'Pasted text example'
        chatGpt.getElement(chatGpt.selectors.messageInput)
            .invoke('val', pasted)
            .trigger('input')
        chatGpt.getElement(chatGpt.selectors.sendButton).click()
        chatGpt.waitForResponse()
        chatGpt.getUserMessages().should('contain', 'Pasted text example')
    })

    /**
     * Example: send message via Enter key
     */
    it('example: should send message with Enter key', () => {
        chatGpt.visit()
        const msg = 'Send via Enter'
        chatGpt.getElement(chatGpt.selectors.messageInput).type(`${msg}{enter}`)
        chatGpt.waitForResponse()
        chatGpt.getUserMessages().should('contain', msg)
    })

    /**
     * Example: conversation persists after reload (best-effort)
     */
    it('example: conversation should persist after reload', () => {
        chatGpt.visit()
        const msg = 'Persist test message'
        chatGpt.sendMessage(msg)
        chatGpt.waitForResponse()
        // reload and assert history still contains the message (if persistence is implemented)
        cy.reload()
        chatGpt.getChatHistory().should('contain', msg)
    })

})
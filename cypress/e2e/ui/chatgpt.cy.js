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

})
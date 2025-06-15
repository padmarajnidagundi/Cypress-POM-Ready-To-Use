import BasePage from './basePage'

const RESPONSE_DELAY_MS = 100;

class ChatGptPage extends BasePage {
    constructor() {
        super()
        this.selectors = {            loginButton: 'button[data-testid="login-button"]',
            messageInput: 'textarea[data-testid="message-input"]',
            sendButton: 'button[data-testid="send-button"]',
            messageResponse: '[data-testid="message-response"]',
            chatHistory: '[data-testid="chat-history"]',
            menuButton: '[data-testid="menu-button"]',
            settingsButton: '[data-testid="settings-button"]',
            errorMessage: '[data-testid="error-message"]',
            loadingIndicator: '[data-testid="loading-indicator"]',
            conversationTitle: '[data-testid="conversation-title"]',
            regenerateButton: '[data-testid="regenerate-button"]',
            clearButton: '[data-testid="clear-button"]',
            userMessage: '[data-testid="user-message"]',
            assistantMessage: '[data-testid="assistant-message"]'
        }
    }

    visit() {
        cy.visit('https://chat.openai.com')
    }

    login(username, password) {
        this.getElement(this.selectors.loginButton).click()
        // Login implementation would go here
        // Note: Actual implementation would depend on the authentication method
    }

    sendMessage(message) {
        this.getElement(this.selectors.messageInput).type(message)
        this.getElement(this.selectors.sendButton).click()
    }

    getLastResponse() {
        return this.getElement(this.selectors.messageResponse).last()
    }

    waitForResponse() {
        return this.getElement(this.selectors.messageResponse)
            .last()
            .should('not.have.text', 'Loading...')
    }

    getChatHistory() {
        return this.getElement(this.selectors.chatHistory)
    }

    openMenu() {
        return this.getElement(this.selectors.menuButton).click()
    }

    openSettings() {
        this.openMenu()
        return this.getElement(this.selectors.settingsButton).click()
    }

    clearConversation() {
        return this.getElement(this.selectors.clearButton).click()
    }

    regenerateResponse() {
        return this.getElement(this.selectors.regenerateButton).click()
    }

    getUserMessages() {
        return this.getElement(this.selectors.userMessage)
    }

    getAssistantMessages() {
        return this.getElement(this.selectors.assistantMessage)
    }

    getErrorMessage() {
        return this.getElement(this.selectors.errorMessage)
    }

    mockResponseFailure(statusCode, errorMessage) {
        cy.intercept('POST', '**/api/chat/**', {
            statusCode: statusCode,
            body: { error: errorMessage },
            delay: RESPONSE_DELAY_MS
        }).as('failedRequest')
    }
}

export default ChatGptPage
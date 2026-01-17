/**
 * Test suite for ChatGPT API integration
 * Tests various aspects of the chat completions endpoint including
 * basic functionality, rate limiting, conversation context, and error handling
 */
describe('ChatGPT API Tests', () => {
  const API_BASE = 'https://api.openai.com/v1'

  /**
   * Set up authorization header for all requests
   * Uses Cypress environment variable for API key
   */
  beforeEach(() => {
    // Set up authorization header for all requests
    cy.intercept('POST', `${API_BASE}/chat/completions`, (req) => {
      req.headers['Authorization'] = `Bearer ${Cypress.env('OPENAI_API_KEY')}`
    })
  })

  /**
   * Tests basic chat completion functionality
   * Verifies successful response and presence of message content
   */
  it('should get a response from chat completions API', () => {
    cy.apiRequest('POST', `${API_BASE}/chat/completions`, {
      body: {
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: 'What is Cypress testing framework?'
          }
        ]
      },
      headers: {
        Authorization: `Bearer ${Cypress.env('OPENAI_API_KEY')}`
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.choices[0].message).to.exist
      expect(response.body.choices[0].message.content).to.not.be.empty
    })
  })

  /**
   * Verifies the presence and structure of rate limiting headers
   * These headers are crucial for implementing proper rate limiting in production
   */
  it('should validate rate limiting headers', () => {
    cy.apiRequest('POST', `${API_BASE}/chat/completions`, {
      body: {
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: 'Hello'
          }
        ]
      },
      headers: {
        Authorization: `Bearer ${Cypress.env('OPENAI_API_KEY')}`
      }
    }).then((response) => {
      expect(response.headers).to.include.keys([
        'x-ratelimit-limit-requests',
        'x-ratelimit-remaining-requests',
        'x-ratelimit-reset-requests'
      ])
    })
  })

  /**
   * Tests the API's ability to maintain conversation context
   * Sends multiple messages and verifies the response is contextually relevant
   * Uses a predefined conversation about TypeScript as a test case
   */
  it('should handle conversation context', () => {
    const conversation = [
      { role: 'user', content: 'What is TypeScript?' },
      { role: 'assistant', content: 'TypeScript is a programming language...' },
      { role: 'user', content: 'What are its main benefits?' }
    ]

    cy.apiRequest('POST', `${API_BASE}/chat/completions`, {
      body: {
        model: 'gpt-4',
        messages: conversation
      },
      headers: {
        Authorization: `Bearer ${Cypress.env('OPENAI_API_KEY')}`
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.choices[0].message.content).to.include.oneOf([
        'benefit',
        'advantage',
        'typescript'
      ])
    })
  })

  /**
   * Tests error handling with invalid model name
   * Verifies that the API returns appropriate error status and response
   * Important for ensuring robust error handling in production
   */
  it('should handle API errors gracefully', () => {
    cy.apiRequest('POST', `${API_BASE}/chat/completions`, {
      body: {
        model: 'non-existent-model',
        messages: [
          {
            role: 'user',
            content: 'Hello'
          }
        ]
      },
      headers: {
        Authorization: `Bearer ${Cypress.env('OPENAI_API_KEY')}`
      }
    }).then((response) => {
      expect(response.status).to.eq(404)
      expect(response.body).to.have.property('error')
    })
  })

  /**
   * Validates the complete structure of the API response
   * Ensures all required fields are present in both the main response
   * and the usage object, which is critical for monitoring API consumption
   */
  it('should validate response structure', () => {
    cy.apiRequest('POST', `${API_BASE}/chat/completions`, {
      body: {
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: 'Write a test case'
          }
        ]
      },
      headers: {
        Authorization: `Bearer ${Cypress.env('OPENAI_API_KEY')}`
      }
    }).then((response) => {
      expect(response.body).to.have.all.keys('id', 'object', 'created', 'model', 'usage', 'choices')
      expect(response.body.usage).to.have.all.keys(
        'prompt_tokens',
        'completion_tokens',
        'total_tokens'
      )
    })
  })
})

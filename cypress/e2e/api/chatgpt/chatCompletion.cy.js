describe('ChatGPT API Tests', () => {
    const API_BASE = 'https://api.openai.com/v1'
    
    beforeEach(() => {
        // Set up authorization header for all requests
        cy.intercept('POST', `${API_BASE}/chat/completions`, (req) => {
            req.headers['Authorization'] = `Bearer ${Cypress.env('OPENAI_API_KEY')}`
        })
    })

    it('should get a response from chat completions API', () => {
        cy.apiRequest('POST', `${API_BASE}/chat/completions`, {
            body: {
                model: 'gpt-4',
                messages: [{
                    role: 'user',
                    content: 'What is Cypress testing framework?'
                }]
            },
            headers: {
                'Authorization': `Bearer ${Cypress.env('OPENAI_API_KEY')}`
            }
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.choices[0].message).to.exist
            expect(response.body.choices[0].message.content).to.not.be.empty
        })
    })

    it('should validate rate limiting headers', () => {
        cy.apiRequest('POST', `${API_BASE}/chat/completions`, {
            body: {
                model: 'gpt-4',
                messages: [{
                    role: 'user',
                    content: 'Hello'
                }]
            },
            headers: {
                'Authorization': `Bearer ${Cypress.env('OPENAI_API_KEY')}`
            }
        }).then((response) => {
            expect(response.headers).to.include.keys([
                'x-ratelimit-limit-requests',
                'x-ratelimit-remaining-requests',
                'x-ratelimit-reset-requests'
            ])
        })
    })

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
                'Authorization': `Bearer ${Cypress.env('OPENAI_API_KEY')}`
            }
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.choices[0].message.content)
                .to.include.oneOf(['benefit', 'advantage', 'typescript'])
        })
    })

    it('should handle API errors gracefully', () => {
        cy.apiRequest('POST', `${API_BASE}/chat/completions`, {
            body: {
                model: 'non-existent-model',
                messages: [{
                    role: 'user',
                    content: 'Hello'
                }]
            },
            headers: {
                'Authorization': `Bearer ${Cypress.env('OPENAI_API_KEY')}`
            }
        }).then((response) => {
            expect(response.status).to.eq(404)
            expect(response.body).to.have.property('error')
        })
    })

    it('should validate response structure', () => {
        cy.apiRequest('POST', `${API_BASE}/chat/completions`, {
            body: {
                model: 'gpt-4',
                messages: [{
                    role: 'user',
                    content: 'Write a test case'
                }]
            },
            headers: {
                'Authorization': `Bearer ${Cypress.env('OPENAI_API_KEY')}`
            }
        }).then((response) => {
            expect(response.body).to.have.all.keys(
                'id',
                'object',
                'created',
                'model',
                'usage',
                'choices'
            )
            expect(response.body.usage).to.have.all.keys(
                'prompt_tokens',
                'completion_tokens',
                'total_tokens'
            )
        })
    })
})
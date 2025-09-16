describe('Users API', () => {
    beforeEach(() => {
        Cypress.config('baseUrl', 'https://reqres.in')
    })

    // Test: Validates the GET users endpoint by checking response structure and data
    it('should retrieve users list successfully', () => {
        cy.request('/api/users?page=2').then((response) => {
            expect(response).to.have.property('status', 200)
            expect(response.body).to.not.be.null
            expect(response.body).to.have.property('page', 2)
            expect(response.body.data).to.be.an('array')
            expect(response.body.data).to.have.length(6)
            response.body.data.forEach(user => {
                expect(user).to.have.all.keys('id', 'email', 'first_name', 'last_name', 'avatar')
            })
        })
    })

    // Test: Validates user creation via POST with required fields
    it('should create a new user successfully', () => {
        cy.request("POST", "/api/users", {
            name: "morpheus",
            job: "leader",
        }).should((response) => {
            expect(response.status).to.eq(201)
            expect(response.body).to.have.property('name', 'morpheus')
            expect(response.body).to.have.property('job', 'leader')
            expect(response.body).to.have.property('id')
            expect(response.body).to.have.property('createdAt')
        })
    })

    // Additional test users
    it('should create a new user: trinity', () => {
        cy.request("POST", "/api/users", {
            name: "trinity",
            job: "operator",
        }).should((response) => {
            expect(response.status).to.eq(201)
            expect(response.body).to.have.property('name', 'trinity')
            expect(response.body).to.have.property('job', 'operator')
            expect(response.body).to.have.property('id')
            expect(response.body).to.have.property('createdAt')
        })
    })

    it('should create a new user: neo', () => {
        cy.request("POST", "/api/users", {
            name: "neo",
            job: "the one",
        }).should((response) => {
            expect(response.status).to.eq(201)
            expect(response.body).to.have.property('name', 'neo')
            expect(response.body).to.have.property('job', 'the one')
            expect(response.body).to.have.property('id')
            expect(response.body).to.have.property('createdAt')
        })
    })

    it('should create a new user: smith', () => {
        cy.request("POST", "/api/users", {
            name: "smith",
            job: "agent",
        }).should((response) => {
            expect(response.status).to.eq(201)
            expect(response.body).to.have.property('name', 'smith')
            expect(response.body).to.have.property('job', 'agent')
            expect(response.body).to.have.property('id')
            expect(response.body).to.have.property('createdAt')
        })
    })

    // Test: Validates user update functionality via PUT request
    it('should update user information successfully', () => {
        cy.request("PUT", "/api/users/2", {
            name: "morpheus-updated",
            job: "team lead",
        }).should((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('name', 'morpheus-updated')
            expect(response.body).to.have.property('job', 'team lead')
            expect(response.body).to.have.property('updatedAt')
        })
    })
})

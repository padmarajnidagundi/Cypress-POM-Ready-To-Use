describe('API Testing', () => {

    describe('API Testing', () => {

        Cypress.config('baseUrl', 'https://reqres.in')
    
        it('Test 1 - GET API testing Using API ', () => {
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
    
        it('Test 2 - POST API testing Using API', () => {
            cy.request("POST", "/api/users", {
                name: "morpheus",
                job: "leader",
              }).should((response) => {
                expect(response.status).to.eq(201);
                expect(response.body).to.have.property('name', 'morpheus')
                expect(response.body).to.have.property('job', 'leader')
                expect(response.body).to.have.property('id')
                expect(response.body).to.have.property('createdAt')
              });
           });
     
    
        it('Test 3 - PUT API testing Using Flip', () => {
            cy.request("PUT", "/api/users/2", {
                name: "QAAutomationLabs",
                job: "QA Automation Engg",
              }).should((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('name', 'QAAutomationLabs')
                expect(response.body).to.have.property('job', 'QA Automation Engg')
                expect(response.body).to.have.property('updatedAt')
              });
            });
    
    
        it("Test 4 - DELETE API testing Using Cypress API", () => {
            cy.request("DELETE", "/api/users/2").should((response) => {
                expect(response.status).to.eq(204);
                expect(response.body).to.be.empty
                });
              });
    
    })
    

})
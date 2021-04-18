describe('API Test on cypress.io', () => {
    it("API Test 1.1 - GET request to that endpoint should return server status", () => {
    cy.request("GET", "https://www.cypress.io/", {
    }).then((response) => {
      // response.body is automatically serialized into JSON
      cy.log(response.body);
     // response.body contain status - headers - duraion
      expect(response.status).to.eq(200)
      expect(response).to.have.property('headers')
      expect(response).to.have.property('duration')
    });
  });
});
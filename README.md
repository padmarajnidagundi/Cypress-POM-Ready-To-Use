
**Cypress-POM-Ready-To-Use** 
Cypress Page Object Basic Model ( Ready To Use ) - UI Test Automation Design Pattern for Cypress.io 
Contact me! if you have more ideas -  [padmaraj.nidagundi@gmail.com](mailto:padmaraj.nidagundi@gmail.com)  

 - https://github.com/padmarajnidagundi/Cypress-POM-Ready-To-Use
 - https://www.npmjs.com/package/cypress-page-object-model
 - https://www.linkedin.com/in/padmarajn/

**How To Setup and Run ==> How To Use Cypress.io Page Object Design Pattern Basic Model ( Ready To Use )**

**Step 1** 

 - Install NodeJs 
   [https://nodejs.org/en/download/](https://nodejs.org/en/download/)  
 - Make Folder called "POM" in C:\POM drive 
 - Open Folder C:\POM\  Using the VSCode editor or any IDE
 - Clone the repo from NPMJS ( npm i cypress-page-object-model  ) or Github.com
 - Go to folder C:\POM\node_modules\cypress-page-object-model>
 - Run comman - npx cypress open ( Its take some time, keep patience for 2-5 min max First time run )
 - Now you can run test - Test1.spec.js

**Step 2** 
**How To Add Page Code ==> Create your individual pages objects with pageName.js in the folder => pageObjects**
**Page code pattern** in the folder => "**pageObjects**"
```
class homePageLinks {

   homepage() {
      return cy.visit('https://www.cypress.io/')
   }
   howitworkspagelink() {
      return cy.get('.styled__MenuWrapper-sc-16oj5lj-1 > .styled__NavList-sc-16oj5lj-3:nth-child(1) > .styled__NavItem-sc-16oj5lj-4:nth-child(2) > .Link-sc-5cc5in-0')
   }
   pricingpagelink() {
      return cy.get('.styled__NavList-sc-16oj5lj-3:nth-child(1) > .styled__NavItem-sc-16oj5lj-4:nth-child(4) > .Link-sc-5cc5in-0')
   }

}

export default homePageLinks

```

**Step 3** 
**How To Add UI Test Case ==> Create your individual test with name contain spec in it:  UITestX.Spec.js in the folder =>  integration**
**Test case code pattern** in the folder =>  **integration**
```
import homePageLinks from '../pageObjects/homePageLinks'
import pricingPageLinks from '../pageObjects/pricingPageLinks'
describe('User visit diffrent pages on cypress.io', () => {
    const l = new homePageLinks()
    it('Test 1.1 - User visit "Home Page" and visit the "How it works"', () => {
        l.homepage()
        cy.title().should('eq', 'JavaScript End to End Testing Framework | cypress.io')  //Verify Page Title with exact & full text
        cy.title().should('include', 'JavaScript')     //Verify Page Title with partial text
        l.howitworkspagelink().click()
        cy.title().should('eq', 'End to End Testing Framework | cypress.io')  //Verify Page Title with exact & full text
        cy.title().should('include', 'End to End')     //Verify Page Title with partial text
    })

    it('Test 1.2 - User visit "Pricing" page and check for the price of cypress.io and click on Team and Business', () => {
        l.homepage()
        l.pricingpagelink().click()
        cy.title().should('eq', 'Pricing | cypress.io')  //Verify Page Title with exact & full text
        cy.title().should('include', 'Pricing')     //Verify Page Title with partial text
        const p = new pricingPageLinks()
        p.teamtab().click()
        p.businesstab().click()
    })
})


```
**Step 4** 
**How To Add API Test Case ==> Create your individual test with name contain spec in it:  API-GETTestX.spec.js in the folder =>  integration**
**Test case code pattern** in the folder =>  **integration**
```
describe('API Test on cypress.io', () => {
    it("API Test 1.1 - GET request to that endpoint should return server status", () => {
    cy.request("GET", "https://www.cypress.io/", {
    }).then((response) => {
      // response.body is automatically serialized into JSON
      cy.log(response.body);
      expect(response.status).to.eq(200)
      expect(response).to.have.property('headers')
      expect(response).to.have.property('duration')
    });
  });
});

```

 **Default used chaijs for assertion**
 [https://www.chaijs.com/](https://www.chaijs.com/)
 [https://docs.cypress.io/guides/references/assertions/](https://docs.cypress.io/guides/references/assertions/)
 
 **Test data is isolated from the test case** in the folder  => **fixtures** using JSON file.

``` 
{
  "name": "Using fixtures to represent data",
  "email": "hello@cypress.io",
  "body": "Fixtures are a great way to mock data for responses to routes"
}
```

 
## Keywords
Cypress, Cypress.io, Chai, Cypress POM, Cypress framework, Software testing, Test automation, Browser Testing, Qualiy assurance, Test automation framework, Test automation framework architecture, Test automation framework design, Page object model, web ui testing, E2E testing, Angular testing, AngularJS testing, Automation, UI testing framework JavaScript, UI testing framework React, Cypress testing, Cypress-testing-library, Cypress-testing-library npm, Cypress testing React, Cypress react testing library, Cypress npm, CypressAPI, Cypress-API-Test

**maintaining codebase tips** **Kudos (Help) for you**
-  npm install --save-dev
-  npm install mochawesome  ( for test report )

**How to run test in diffrent modes** **Kudos (Help) for you**
-  npx cypress open
-  npx cypress run
-  npx cypress run --browser chrome
-  npx cypress run --browser chrome --headless
-  npx cypress run --spec cypress/integration/UITest1.spec.js

**Cypress API**
-  https://docs.cypress.io/api/table-of-contents

**Selecting a single element - querying DOM**

``` 
<h1>Numbers:</h1>
<div class="one"></div>
<div id="two"></div>
<div shape="three"></div>

.get('one') // select by tag
.get('.square') // select by class
.get('#two') // select by id
.get('[shape="three"]'); // select by attribute

```

**debugging tests in Cypress**

``` 
.pause()
console.log()

```
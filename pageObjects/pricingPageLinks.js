class pricingPageLinks {

   teamtab() {
      return cy.get('.Toggle__Indicator-sc-1pryher-3')
   }
   businesstab() {
      return cy.get('.Toggle__Option-sc-1pryher-2:nth-child(3)')
   }

}

export default pricingPageLinks
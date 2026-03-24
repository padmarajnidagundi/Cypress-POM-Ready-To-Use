import pricingPageLinks from '../../pageObjects/pricingPageLinks'
import HomePageLinks from '../../pageObjects/homePageLinks'

/**
 * Mock HTML that replicates the pricing toggle structure expected by pricingPageLinks.
 * Using controlled HTML keeps these tests self-contained and independent of external sites.
 */
const MOCK_PRICING_HTML = `
  <!DOCTYPE html>
  <html lang="en">
  <head><title>Pricing Plans</title></head>
  <body>
    <h1>Choose Your Plan</h1>
    <p>Select the plan that works best for you.</p>
    <nav aria-label="pricing navigation">
      <a href="/pricing">Pricing</a>
    </nav>
    <div class="pricing-toggle" data-testid="pricing-toggle">
      <div
        class="Toggle__Indicator-sc-1pryher-3"
        data-testid="team-toggle-indicator"
        role="switch"
        aria-label="Plan toggle"
        aria-checked="false"
        tabindex="0"
      ></div>
      <div class="Toggle__Option-sc-1pryher-2">Individual</div>
      <div class="Toggle__Option-sc-1pryher-2">Team</div>
      <div class="Toggle__Option-sc-1pryher-2">Business</div>
    </div>
    <section data-testid="plan-details">
      <h2>Team Plan</h2>
      <p>Collaborate with your team.</p>
    </section>
  </body>
  </html>
`

/**
 * Pricing Page Test Suite
 *
 * Covers the pricingPageLinks page object (teamtab / businesstab methods) which
 * previously had zero test coverage. Tests run against injected mock HTML so they
 * are fully self-contained and not dependent on an external live site.
 *
 * Also exercises BasePage.getByTestId() via the HomePageLinks page object to
 * cover that previously-untested utility method.
 */
describe('Pricing Page - Page Object Tests', () => {
  const pricingPage = new pricingPageLinks()

  /**
   * Intercept the page request and return controlled mock HTML before every test
   * so each test starts with a predictable DOM that contains the selectors used
   * by pricingPageLinks. Using cy.intercept() is the recommended Cypress way to
   * serve custom HTML without relying on document.write() or an external server.
   */
  beforeEach(() => {
    cy.intercept('GET', '**/pricing-mock', {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: MOCK_PRICING_HTML
    }).as('pricingMock')
    cy.visit('https://example.cypress.io/pricing-mock', { failOnStatusCode: false })
  })

  /**
   * Verifies that the team tab toggle indicator element exists in the DOM.
   * Covers pricingPageLinks.teamtab()
   */
  it('should find the team tab toggle indicator element', () => {
    pricingPage.teamtab().should('exist')
  })

  /**
   * Verifies that the team tab toggle indicator is visible to the user.
   */
  it('should display the team tab toggle indicator as visible', () => {
    pricingPage.teamtab().should('be.visible')
  })

  /**
   * Verifies that the team tab element carries the expected role attribute
   * (accessibility requirement for switch-style toggles).
   */
  it('should have a role attribute on the team tab toggle', () => {
    pricingPage.teamtab().should('have.attr', 'role', 'switch')
  })

  /**
   * Verifies that the business tab option (3rd pricing tier) exists in the DOM.
   * Covers pricingPageLinks.businesstab()
   */
  it('should find the business tab option element', () => {
    pricingPage.businesstab().should('exist')
  })

  /**
   * Verifies that the business tab option is visible to the user.
   */
  it('should display the business tab option as visible', () => {
    pricingPage.businesstab().should('be.visible')
  })

  /**
   * Verifies that the business tab contains text (it is not empty).
   */
  it('should have non-empty text in the business tab option', () => {
    pricingPage.businesstab().invoke('text').should('not.be.empty')
  })

  /**
   * Verifies the full set of pricing tier options are rendered.
   * Ensures the page structure is complete (Individual, Team, Business).
   */
  it('should render all three pricing tier options', () => {
    cy.get('.Toggle__Option-sc-1pryher-2').should('have.length', 3)
  })

  /**
   * Verifies that both page object methods return distinct elements
   * (the toggle indicator and the 3rd option are different DOM nodes).
   */
  it('should return different elements for teamtab and businesstab', () => {
    pricingPage.teamtab().then(($team) => {
      pricingPage.businesstab().then(($business) => {
        expect($team[0]).to.not.equal($business[0])
      })
    })
  })

  /**
   * BasePage.getByTestId() coverage
   *
   * HomePageLinks extends BasePage and therefore inherits getByTestId().
   * Exercises the method against the data-testid attributes present in the
   * mock pricing HTML, giving the previously-untested utility its first coverage.
   */
  describe('BasePage.getByTestId() coverage via HomePageLinks', () => {
    const homePage = new HomePageLinks()

    it('should locate the pricing toggle container by data-testid', () => {
      homePage.getByTestId('pricing-toggle').should('exist').and('be.visible')
    })

    it('should locate the team toggle indicator by data-testid', () => {
      homePage.getByTestId('team-toggle-indicator').should('exist').and('be.visible')
    })

    it('should locate the plan details section by data-testid', () => {
      homePage.getByTestId('plan-details').should('exist').and('be.visible')
    })

    it('should not find a non-existent data-testid', () => {
      homePage.getByTestId('does-not-exist').should('not.exist')
    })
  })
})

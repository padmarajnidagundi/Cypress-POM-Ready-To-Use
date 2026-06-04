import HomePageLinks from '../../pageObjects/homePageLinks'

describe('BasePage core behavior', () => {
  const homePage = new HomePageLinks()

  it('should visit example URL and find expected heading text', () => {
    homePage.visit()
    homePage.containsText('Kitchen Sink').should('be.visible')
  })
})

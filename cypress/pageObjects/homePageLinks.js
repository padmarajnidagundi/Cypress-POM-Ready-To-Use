import BasePage from './basePage'

class HomePageLinks extends BasePage {
    constructor() {
        super()
        this.selectors = {
            header: 'h1',
            navigationLink: 'a'
        }
    }

    getHeader() {
        return this.getElement(this.selectors.header)
    }

    getNavigationLink(linkText) {
        return this.getElement(this.selectors.navigationLink).contains(linkText)
    }
}

export default HomePageLinks
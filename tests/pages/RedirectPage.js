const { BasePage } = require('./BasePage');
const { routes } = require('../routes');

class RedirectPage extends BasePage {
  constructor(page) {
    super(page);
    this.link = page.getByTestId('redirect-link');
  }

  async goto() {
    await this.page.goto(routes.redirect.base);
  }
}

class RedirectTargetPage extends BasePage {
  constructor(page) {
    super(page);
    this.message = page.getByTestId('redirect-message');
  }
}

module.exports = { RedirectPage, RedirectTargetPage };

const { BasePage } = require('./BasePage');
const { routes } = require('../routes');

class BasicAuthPage extends BasePage {
  constructor(page) {
    super(page);
    this.message = page.getByTestId('basic-auth-message');
  }

  async goto() {
    await this.page.goto(routes.basicAuth);
  }
}

module.exports = { BasicAuthPage };

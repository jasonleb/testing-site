const { BasePage } = require('./BasePage');
const { routes } = require('../routes');

class StatusCodesPage extends BasePage {
  constructor(page) {
    super(page);
    this.links = page.locator('#status-code-links a');
    this.link200 = page.getByTestId('status-200');
    this.link301 = page.getByTestId('status-301');
    this.link404 = page.getByTestId('status-404');
    this.link500 = page.getByTestId('status-500');
  }

  async goto() {
    await this.page.goto(routes.statusCodes.base);
  }
}

class StatusResultPage extends BasePage {
  constructor(page) {
    super(page);
    this.code = page.getByTestId('status-code');
    this.message = page.getByTestId('status-message');
  }
}

module.exports = { StatusCodesPage, StatusResultPage };

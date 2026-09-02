const { BasePage } = require('./BasePage');
const { routes } = require('../routes');

class AlertsPage extends BasePage {
  constructor(page) {
    super(page);
    this.alertButton = page.getByTestId('btn-alert');
    this.confirmButton = page.getByTestId('btn-confirm');
    this.promptButton = page.getByTestId('btn-prompt');
    this.result = page.getByTestId('alert-result');
  }

  async goto() {
    await this.page.goto(routes.alerts);
  }
}

module.exports = { AlertsPage };

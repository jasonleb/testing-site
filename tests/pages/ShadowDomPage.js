const { BasePage } = require('./BasePage');
const { routes } = require('../routes');

class ShadowDomPage extends BasePage {
  constructor(page) {
    super(page);
    this.widget = page.getByTestId('shadow-widget');
    // Playwright traverse le Shadow DOM automatiquement, donc ces locators
    // fonctionnent même si shadow-text / shadow-button vivent dans le
    // shadowRoot du <test-widget> plutôt que dans le DOM léger.
    this.text = page.getByTestId('shadow-text');
    this.incrementButton = page.getByTestId('shadow-button');
  }

  async goto() {
    await this.page.goto(routes.shadowDom);
  }

  async increment(times = 1) {
    for (let i = 0; i < times; i++) {
      await this.incrementButton.click();
    }
  }
}

module.exports = { ShadowDomPage };

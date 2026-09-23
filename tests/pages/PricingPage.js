const { BasePage } = require('./BasePage');
const { routes } = require('../routes');

class PricingPage extends BasePage {
  constructor(page) {
    super(page);
    this.ageInput = page.getByTestId('pricing-age');
    this.memberCheckbox = page.getByTestId('pricing-member');
    this.submitButton = page.getByTestId('pricing-submit');
    this.error = page.getByTestId('pricing-error');
    this.result = page.getByTestId('pricing-result');
    this.category = page.getByTestId('pricing-category');
    this.discount = page.getByTestId('pricing-discount');
    this.finalPrice = page.getByTestId('pricing-final');
  }

  async goto() {
    await this.page.goto(routes.pricing);
  }

  async calculate(age, { member = false } = {}) {
    await this.ageInput.fill(String(age));
    await this.memberCheckbox.setChecked(member);
    await this.submitButton.click();
  }
}

module.exports = { PricingPage };

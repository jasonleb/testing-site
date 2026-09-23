const { BasePage } = require('./BasePage');
const { routes } = require('../routes');

class ShippingPage extends BasePage {
  constructor(page) {
    super(page);
    this.amountInput = page.getByTestId('shipping-amount');
    this.zoneSelect = page.getByTestId('shipping-zone');
    this.premiumCheckbox = page.getByTestId('shipping-premium');
    this.bulkyCheckbox = page.getByTestId('shipping-bulky');
    this.submitButton = page.getByTestId('shipping-submit');
    this.error = page.getByTestId('shipping-error');
    this.result = page.getByTestId('shipping-result');
    this.undeliverable = page.getByTestId('shipping-undeliverable');
    this.baseFee = page.getByTestId('shipping-base');
    this.surcharge = page.getByTestId('shipping-surcharge');
    this.total = page.getByTestId('shipping-total');
  }

  async goto() {
    await this.page.goto(routes.shipping);
  }

  async calculate(amount, { zone = 'nationale', premium = false, bulky = false } = {}) {
    await this.amountInput.fill(String(amount));
    await this.zoneSelect.selectOption(zone);
    await this.premiumCheckbox.setChecked(premium);
    await this.bulkyCheckbox.setChecked(bulky);
    await this.submitButton.click();
  }
}

module.exports = { ShippingPage };

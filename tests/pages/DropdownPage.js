const { BasePage } = require('./BasePage');
const { routes } = require('../routes');

class DropdownPage extends BasePage {
  constructor(page) {
    super(page);
    this.select = page.getByTestId('dropdown');
    this.result = page.locator('#dropdown-result');
    this.customToggle = page.getByTestId('custom-dropdown-toggle');
    this.customList = page.getByTestId('custom-dropdown-list');
    this.customResult = page.locator('#custom-dropdown-result');
  }

  async goto() {
    await this.page.goto(routes.dropdown);
  }

  async selectNativeOption(label) {
    await this.select.selectOption({ label });
  }

  /** Option du menu déroulant personnalisé, par sa valeur (ex: 'geneve') */
  customOption(value) {
    return this.page.getByTestId(`custom-dropdown-option-${value}`);
  }

  async openCustomDropdown() {
    await this.customToggle.click();
  }
}

module.exports = { DropdownPage };

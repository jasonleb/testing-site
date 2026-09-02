const { BasePage } = require('./BasePage');
const { routes } = require('../routes');

class CheckboxesPage extends BasePage {
  constructor(page) {
    super(page);
    this.checkbox1 = page.getByTestId('checkbox-1');
    this.checkbox2 = page.getByTestId('checkbox-2');
    this.checkAllButton = page.getByTestId('check-all');
    this.uncheckAllButton = page.getByTestId('uncheck-all');
  }

  async goto() {
    await this.page.goto(routes.checkboxes);
  }
}

module.exports = { CheckboxesPage };

const { BasePage } = require('./BasePage');
const { routes } = require('../routes');

class SlowResourcePage extends BasePage {
  constructor(page) {
    super(page);
    this.image = page.getByTestId('slow-image');
    this.loadDataButton = page.getByTestId('load-data');
    this.dataResult = page.getByTestId('slow-data-result');
  }

  async goto() {
    await this.page.goto(routes.slowResource);
  }
}

module.exports = { SlowResourcePage };

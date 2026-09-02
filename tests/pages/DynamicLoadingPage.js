const { BasePage } = require('./BasePage');
const { routes } = require('../routes');

class DynamicLoadingPage extends BasePage {
  constructor(page) {
    super(page);
    this.start1 = page.getByTestId('start-1');
    this.loading1 = page.getByTestId('loading-1');
    this.finish1 = page.getByTestId('finish-1');

    this.start2 = page.getByTestId('start-2');
    this.loading2 = page.getByTestId('loading-2');
    this.finish2 = page.getByTestId('finish-2');
  }

  async goto() {
    await this.page.goto(routes.dynamicLoading);
  }
}

module.exports = { DynamicLoadingPage };

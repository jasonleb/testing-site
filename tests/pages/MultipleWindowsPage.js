const { BasePage } = require('./BasePage');
const { routes } = require('../routes');

class MultipleWindowsPage extends BasePage {
  constructor(page) {
    super(page);
    this.newWindowLink = page.getByTestId('new-window-link');
    this.newWindowButton = page.getByTestId('new-window-button');
  }

  async goto() {
    await this.page.goto(routes.multipleWindows);
  }
}

class MultipleWindowsNewPage extends BasePage {
  constructor(page) {
    super(page);
    this.message = page.getByTestId('new-window-message');
  }
}

module.exports = { MultipleWindowsPage, MultipleWindowsNewPage };

const { BasePage } = require('./BasePage');
const { routes } = require('../routes');

class InfiniteScrollPage extends BasePage {
  constructor(page) {
    super(page);
    this.container = page.getByTestId('scroll-container');
    this.sentinel = page.getByTestId('scroll-sentinel');
  }

  async goto() {
    await this.page.goto(routes.infiniteScroll);
  }

  /** Paragraphe chargé dynamiquement, par son numéro (ex: paragraph(10)) */
  paragraph(n) {
    return this.page.getByTestId(`paragraph-${n}`);
  }

  async scrollToSentinel() {
    await this.sentinel.scrollIntoViewIfNeeded();
  }
}

module.exports = { InfiniteScrollPage };

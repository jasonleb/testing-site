const { BasePage } = require('./BasePage');
const { routes } = require('../routes');

class BrokenImagesPage extends BasePage {
  constructor(page) {
    super(page);
    this.validImage = page.getByTestId('image-valid');
    this.image404 = page.getByTestId('image-404');
    this.image500 = page.getByTestId('image-500');
  }

  async goto() {
    await this.page.goto(routes.brokenImages);
  }
}

module.exports = { BrokenImagesPage };

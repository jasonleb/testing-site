const { BasePage } = require('./BasePage');
const { routes } = require('../routes');

class HiddenElementsPage extends BasePage {
  constructor(page) {
    super(page);
    this.displayNoneElement = page.getByTestId('hidden-display-none');
    this.revealDisplayNoneButton = page.getByTestId('reveal-display-none');
    this.visibilityHiddenElement = page.getByTestId('hidden-visibility');
    this.opacityZeroElement = page.getByTestId('hidden-opacity');
    this.zeroSizeElement = page.getByTestId('hidden-zero-size');
  }

  async goto() {
    await this.page.goto(routes.hiddenElements);
  }

  /** Boîte parente (0×0px, overflow:hidden) qui contient l'élément "taille nulle" */
  zeroSizeContainerBox() {
    return this.zeroSizeElement.locator('..').boundingBox();
  }
}

module.exports = { HiddenElementsPage };

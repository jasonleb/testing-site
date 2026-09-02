const { BasePage } = require('./BasePage');
const { routes } = require('../routes');

class DragAndDropPage extends BasePage {
  constructor(page) {
    super(page);
    this.columnA = page.getByTestId('column-a');
    this.columnB = page.getByTestId('column-b');
  }

  async goto() {
    await this.page.goto(routes.dragAndDrop);
  }

  async swapColumns() {
    await this.columnA.dragTo(this.columnB);
  }
}

module.exports = { DragAndDropPage };

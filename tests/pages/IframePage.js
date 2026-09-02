const { BasePage } = require('./BasePage');
const { routes } = require('../routes');

class IframePage extends BasePage {
  constructor(page) {
    super(page);
    this.editorBody = page.frameLocator('#editor-frame').locator('body');
    this.innerFrameBody = page
      .frameLocator('#outer-frame')
      .frameLocator('#inner-frame')
      .locator('body');
  }

  async goto() {
    await this.page.goto(routes.iframe);
  }

  async replaceEditorText(text) {
    await this.editorBody.click();
    await this.editorBody.press('Control+A');
    await this.editorBody.pressSequentially(text);
  }
}

module.exports = { IframePage };

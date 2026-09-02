const { BasePage } = require('./BasePage');
const { routes } = require('../routes');

class FileUploadPage extends BasePage {
  constructor(page) {
    super(page);
    this.fileInput = page.getByTestId('file-input');
    this.submitButton = page.getByTestId('upload-submit');
    this.successMessage = page.getByTestId('upload-success');
    this.errorMessage = page.getByTestId('upload-error');
    this.uploadedLinks = page.getByTestId('uploaded-file-link');
  }

  async goto() {
    await this.page.goto(routes.fileUpload);
  }

  async uploadFile(filePath) {
    await this.fileInput.setInputFiles(filePath);
    await this.submitButton.click();
  }

  async submitWithoutFile() {
    await this.submitButton.click();
  }

  /** Liens de fichiers déjà envoyés dont le nom contient `text` */
  uploadedLinksContaining(text) {
    return this.uploadedLinks.filter({ hasText: text });
  }
}

module.exports = { FileUploadPage };

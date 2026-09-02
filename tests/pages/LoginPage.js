const { BasePage } = require('./BasePage');
const { routes } = require('../routes');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.form = page.getByTestId('login-form');
    this.usernameInput = page.getByTestId('username');
    this.passwordInput = page.getByTestId('password');
    this.submitButton = page.getByTestId('login-submit');
    this.error = page.getByTestId('login-error');
  }

  async goto() {
    await this.page.goto(routes.login);
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}

class SecurePage extends BasePage {
  constructor(page) {
    super(page);
    this.message = page.getByTestId('secure-message');
    this.logoutLink = page.getByTestId('logout-link');
  }

  async goto() {
    await this.page.goto(routes.secure);
  }

  async logout() {
    await this.logoutLink.click();
  }
}

module.exports = { LoginPage, SecurePage };

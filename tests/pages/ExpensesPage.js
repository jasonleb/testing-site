const { BasePage } = require('./BasePage');
const { routes } = require('../routes');

class ExpensesPage extends BasePage {
  constructor(page) {
    super(page);
    this.userSelect = page.getByTestId('expenses-user');
    this.resetButton = page.getByTestId('expenses-reset');
    this.message = page.getByTestId('expenses-message');
    this.rows = page.getByTestId('expenses-tbody').locator('tr');
    this.formTitle = page.getByTestId('expense-form-title');
    this.labelInput = page.getByTestId('expense-label');
    this.amountInput = page.getByTestId('expense-amount');
    this.saveButton = page.getByTestId('expense-save');
  }

  async goto() {
    await this.page.goto(routes.expenses);
    await this.rows.first().waitFor();
  }

  async actAs(userId) {
    await this.userSelect.selectOption(userId);
  }

  state(id) { return this.page.getByTestId(`expense-state-${id}`); }
  label(id) { return this.page.getByTestId(`expense-label-${id}`); }
  reason(id) { return this.page.getByTestId(`expense-reason-${id}`); }
  actionButton(id, action) { return this.page.getByTestId(`expense-${action}-${id}`); }
  actionButtons(id) { return this.page.getByTestId(`expense-row-${id}`).locator('button[data-action]'); }

  async doAction(id, action) {
    await this.actionButton(id, action).click();
  }

  async reject(id, reason) {
    await this.page.getByTestId(`expense-reason-input-${id}`).fill(reason);
    await this.doAction(id, 'reject');
  }

  async fillAndSave(label, amount) {
    await this.labelInput.fill(label);
    await this.amountInput.fill(String(amount));
    await this.saveButton.click();
  }
}

module.exports = { ExpensesPage };

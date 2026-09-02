const { BasePage } = require('./BasePage');
const { routes } = require('../routes');

class TablesPage extends BasePage {
  constructor(page) {
    super(page);
    this.table = page.getByTestId('sortable-table');
    this.headerPrenom = page.getByTestId('th-prenom');
    this.headerNom = page.getByTestId('th-nom');
    this.headerAge = page.getByTestId('th-age');
    this.headerVille = page.getByTestId('th-ville');
    this.rows = page.locator('#sortable-tbody tr');
  }

  async goto() {
    await this.page.goto(routes.tables);
  }

  /** Valeurs texte de toutes les lignes pour une colonne donnée (0 = 1re colonne) */
  async columnValues(colIndex) {
    return this.rows.evaluateAll(
      (rows, i) => rows.map((r) => r.children[i].textContent.trim()),
      colIndex
    );
  }
}

module.exports = { TablesPage };

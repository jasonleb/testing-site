const { BasePage } = require('./BasePage');
const { routes } = require('../routes');

class HomePage extends BasePage {
  constructor(page) {
    super(page);
    // La sidebar listant les défis a disparu avec la refonte Arcade :
    // la grille de cartes de l'accueil EST la navigation désormais.
    this.brand = page.getByTestId('nav-brand');
    this.challengeCards = page.locator('.arcade-grid .card');
    this.automationCards = page.getByTestId('automation-grid').locator('.card');
    this.businessGrid = page.getByTestId('business-grid');
    this.businessCards = this.businessGrid.locator('.card');
    this.businessIntro = page.getByTestId('business-intro');
  }

  async goto() {
    await this.page.goto(routes.home);
  }

  /** Carte de la grille d'accueil vers un défi, par son id */
  card(challengeId) {
    return this.page.getByTestId(`card-${challengeId}`);
  }
}

module.exports = { HomePage };

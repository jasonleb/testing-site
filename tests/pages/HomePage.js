const { BasePage } = require('./BasePage');
const { routes } = require('../routes');

class HomePage extends BasePage {
  constructor(page) {
    super(page);
    // La sidebar listant les 18 défis a disparu avec la refonte Arcade :
    // la grille de cartes de l'accueil EST la navigation désormais.
    this.brand = page.getByTestId('nav-brand');
    this.challengeCards = page.locator('#challenge-grid .card');
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

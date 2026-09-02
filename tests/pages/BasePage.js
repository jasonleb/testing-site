/**
 * Classe de base pour tous les Page Objects.
 * Chaque page hérite de BasePage et déclare ses propres locators
 * (via data-testid en priorité) dans son constructeur, plus ses
 * actions métier. Les fichiers de test ne doivent jamais contenir
 * de sélecteur brut : tout passe par ces classes.
 */
class BasePage {
  constructor(page) {
    this.page = page;
  }
}

module.exports = { BasePage };

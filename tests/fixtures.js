/**
 * Point d'entrée unique pour les tests : au lieu d'importer `test`/`expect`
 * depuis @playwright/test, chaque spec importe ce fichier et reçoit en plus
 * un fixture prêt à l'emploi par page (ex: `dropdownPage`, `loginPage`...).
 *
 * Avantage : si l'id d'un élément change sur le site, on modifie UNE seule
 * ligne dans tests/pages/<LaPage>.js — aucun fichier de test à toucher.
 */
const base = require('@playwright/test');

const { HomePage } = require('./pages/HomePage');
const { DropdownPage } = require('./pages/DropdownPage');
const { IframePage } = require('./pages/IframePage');
const { AlertsPage } = require('./pages/AlertsPage');
const { DynamicLoadingPage } = require('./pages/DynamicLoadingPage');
const { DragAndDropPage } = require('./pages/DragAndDropPage');
const { FileUploadPage } = require('./pages/FileUploadPage');
const { HiddenElementsPage } = require('./pages/HiddenElementsPage');
const { InfiniteScrollPage } = require('./pages/InfiniteScrollPage');
const { LoginPage, SecurePage } = require('./pages/LoginPage');
const { TablesPage } = require('./pages/TablesPage');
const { StatusCodesPage, StatusResultPage } = require('./pages/StatusCodesPage');
const { ShadowDomPage } = require('./pages/ShadowDomPage');
const { SlowResourcePage } = require('./pages/SlowResourcePage');
const { BrokenImagesPage } = require('./pages/BrokenImagesPage');
const { MultipleWindowsPage, MultipleWindowsNewPage } = require('./pages/MultipleWindowsPage');
const { BasicAuthPage } = require('./pages/BasicAuthPage');
const { RedirectPage, RedirectTargetPage } = require('./pages/RedirectPage');
const { CheckboxesPage } = require('./pages/CheckboxesPage');

const test = base.test.extend({
  homePage: async ({ page }, use) => use(new HomePage(page)),
  dropdownPage: async ({ page }, use) => use(new DropdownPage(page)),
  iframePage: async ({ page }, use) => use(new IframePage(page)),
  alertsPage: async ({ page }, use) => use(new AlertsPage(page)),
  dynamicLoadingPage: async ({ page }, use) => use(new DynamicLoadingPage(page)),
  dragAndDropPage: async ({ page }, use) => use(new DragAndDropPage(page)),
  fileUploadPage: async ({ page }, use) => use(new FileUploadPage(page)),
  hiddenElementsPage: async ({ page }, use) => use(new HiddenElementsPage(page)),
  infiniteScrollPage: async ({ page }, use) => use(new InfiniteScrollPage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  securePage: async ({ page }, use) => use(new SecurePage(page)),
  tablesPage: async ({ page }, use) => use(new TablesPage(page)),
  statusCodesPage: async ({ page }, use) => use(new StatusCodesPage(page)),
  statusResultPage: async ({ page }, use) => use(new StatusResultPage(page)),
  shadowDomPage: async ({ page }, use) => use(new ShadowDomPage(page)),
  slowResourcePage: async ({ page }, use) => use(new SlowResourcePage(page)),
  brokenImagesPage: async ({ page }, use) => use(new BrokenImagesPage(page)),
  multipleWindowsPage: async ({ page }, use) => use(new MultipleWindowsPage(page)),
  basicAuthPage: async ({ page }, use) => use(new BasicAuthPage(page)),
  redirectPage: async ({ page }, use) => use(new RedirectPage(page)),
  checkboxesPage: async ({ page }, use) => use(new CheckboxesPage(page)),
});

const expect = base.expect;

// Exposées pour les cas où un test a besoin d'attacher un Page Object à une
// AUTRE page que celle du fixture (ex: un popup ouvert dans un nouvel onglet).
const PageObjects = {
  MultipleWindowsNewPage,
  RedirectTargetPage,
};

module.exports = { test, expect, PageObjects };

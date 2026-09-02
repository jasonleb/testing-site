const { test, expect } = require('./fixtures');

test.describe('Éléments cachés', () => {
  test.beforeEach(async ({ hiddenElementsPage }) => {
    await hiddenElementsPage.goto();
  });

  test('display:none est caché puis révélé au clic', async ({ hiddenElementsPage }) => {
    await expect(hiddenElementsPage.displayNoneElement).toBeHidden();
    await hiddenElementsPage.revealDisplayNoneButton.click();
    await expect(hiddenElementsPage.displayNoneElement).toBeVisible();
  });

  test('visibility:hidden est considéré comme caché', async ({ hiddenElementsPage }) => {
    await expect(hiddenElementsPage.visibilityHiddenElement).toBeHidden();
  });

  test('opacity:0 reste techniquement visible pour Playwright', async ({ hiddenElementsPage }) => {
    // Playwright ne considère pas opacity:0 comme "hidden" : bonne illustration
    // de la différence entre "invisible à l'œil" et "invisible pour l'outil".
    await expect(hiddenElementsPage.opacityZeroElement).toBeVisible();
  });

  test('taille nulle : caché à l\'écran mais "visible" pour Playwright', async ({ hiddenElementsPage }) => {
    // Le conteneur parent est réellement 0×0px avec overflow:hidden : rien n'est peint à l'écran.
    const parentBox = await hiddenElementsPage.zeroSizeContainerBox();
    expect(parentBox.width).toBe(0);
    expect(parentBox.height).toBe(0);

    // Mais Playwright ne juge la visibilité que sur les propriétés CSS de l'élément
    // lui-même (display, visibility, opacity, sa propre taille) — pas sur le clipping
    // imposé par un ancêtre — donc il rapporte quand même "visible". Piège classique :
    // un test qui se contente de toBeVisible() peut passer à côté d'un élément
    // réellement invisible à l'écran.
    await expect(hiddenElementsPage.zeroSizeElement).toBeVisible();
  });
});

const { test, expect } = require('./fixtures');
const path = require('path');

test.describe('Upload de fichier', () => {
  test('envoyer un fichier et le voir listé', async ({ fileUploadPage }) => {
    await fileUploadPage.goto();

    const filePath = path.join(__dirname, 'fixtures', 'sample-upload.txt');
    await fileUploadPage.uploadFile(filePath);

    await expect(fileUploadPage.successMessage).toContainText('sample-upload.txt');
    // On ne vérifie pas un compte exact : relancer la suite plusieurs fois
    // accumule des fichiers (le serveur ne les écrase pas), donc on vérifie
    // juste qu'au moins un lien vers ce fichier est bien présent.
    await expect(fileUploadPage.uploadedLinksContaining('sample-upload.txt').first()).toBeVisible();
  });

  test("afficher une erreur si aucun fichier n'est sélectionné", async ({ fileUploadPage }) => {
    await fileUploadPage.goto();
    await fileUploadPage.submitWithoutFile();
    await expect(fileUploadPage.errorMessage).toContainText('Aucun fichier');
  });
});

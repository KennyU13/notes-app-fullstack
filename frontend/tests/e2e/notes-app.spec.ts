import { expect, test } from '@playwright/test';

test('parcours complet : inscription, categorie, note, edition, detail categorie, epingle et corbeille', async ({ page }) => {
  const suffixe = Date.now();
  const email = `e2e-${suffixe}@notes.local`;
  const motDePasse = 'password123';
  const categorie = `Categorie E2E ${suffixe}`;
  const titreInitial = `Note E2E ${suffixe}`;
  const contenuInitial = 'Contenu cree depuis Playwright';
  const titreModifie = `Note E2E modifiee ${suffixe}`;
  const contenuModifie = 'Contenu modifie et conserve apres actualisation';

  await page.goto('/inscription');
  await page.getByPlaceholder('Prenom', { exact: true }).fill('Test');
  await page.getByPlaceholder('Nom', { exact: true }).fill('E2E');
  await page.getByPlaceholder('Email').fill(email);
  await page.getByPlaceholder('Mot de passe').fill(motDePasse);
  await page.getByRole('button', { name: 'Creer mon compte' }).click();

  await expect(page.getByRole('heading', { name: 'Tableau de bord' })).toBeVisible();

  await page.getByRole('link', { name: 'Categories' }).click();
  await expect(page.getByRole('heading', { name: 'Categories' })).toBeVisible();
  await page.getByPlaceholder('Nouvelle categorie').fill(categorie);
  await page.getByRole('button', { name: 'Ajouter' }).click();
  await expect(page.getByText(categorie).first()).toBeVisible();

  await page.getByRole('button', { name: /Nouvelle note/i }).click();
  await page.getByPlaceholder('Titre de la note').fill(titreInitial);
  await page.getByPlaceholder('Contenu').fill(contenuInitial);
  await page.locator('select').selectOption({ label: categorie });
  await page.getByPlaceholder('Ajouter un tag').fill('e2e');
  await page.getByRole('button', { name: 'Ajouter' }).click();
  await page.locator('input[type="file"]').setInputFiles('tests/fixtures/piece-jointe.txt');
  await page.getByRole('button', { name: 'Enregistrer' }).click();

  await expect(page.getByRole('heading', { name: 'Modifier la note' })).toBeVisible();
  await expect(page.getByPlaceholder('Titre de la note')).toHaveValue(titreInitial);
  await expect(page.getByPlaceholder('Contenu')).toHaveValue(contenuInitial);

  await page.getByPlaceholder('Titre de la note').fill(titreModifie);
  await page.getByPlaceholder('Contenu').fill(contenuModifie);
  await page.getByRole('button', { name: 'Enregistrer' }).click();
  await expect(page.getByPlaceholder('Titre de la note')).toHaveValue(titreModifie);

  await page.getByRole('link', { name: 'Notes' }).click();
  await expect(page.getByText(titreModifie)).toBeVisible();

  await page.getByRole('button', { name: categorie }).click();
  await expect(page).toHaveURL(/\/categories\//);
  await expect(page.getByRole('heading', { name: categorie })).toBeVisible();
  await expect(page.getByText('1', { exact: true })).toBeVisible();
  await expect(page.getByText('note associee')).toBeVisible();
  await expect(page.getByText(titreModifie)).toBeVisible();

  await page.reload();
  await expect(page.getByRole('heading', { name: categorie })).toBeVisible();
  await expect(page.getByText(titreModifie)).toBeVisible();
  await expect(page.getByText(contenuModifie)).toBeVisible();

  await page.getByRole('link', { name: 'Notes' }).click();
  await expect(page).toHaveURL(/\/notes$/);
  await expect(page.getByText(titreModifie)).toBeVisible();
  await expect(page.getByText('1 piece(s)')).toBeVisible();

  const telechargement = page.waitForEvent('download');
  await page.getByRole('button', { name: 'JSON' }).click();
  expect((await telechargement).suggestedFilename()).toBe('notes.json');

  const reponseEpingle = page.waitForResponse((reponse) => reponse.url().includes('/epingler') && reponse.request().method() === 'PATCH');
  await page.getByRole('button', { name: 'Epingler' }).click();
  await expect((await reponseEpingle).ok()).toBeTruthy();
  await expect(page.getByRole('article').filter({ hasText: titreModifie }).getByTitle('Epingler')).toHaveClass(/text-cyan-200/);

  await page.getByRole('button', { name: 'Supprimer' }).click();
  await expect(page.getByRole('heading', { name: 'Deplacer cette note dans la corbeille ?' })).toBeVisible();
  await page.getByRole('button', { name: 'Confirmer' }).click();
  await expect(page.getByText(titreModifie)).toBeHidden();

  await page.getByRole('link', { name: 'Corbeille' }).click();
  await expect(page.getByRole('heading', { name: 'Corbeille' })).toBeVisible();
  await expect(page.getByText(titreModifie)).toBeVisible();
  await page.getByRole('button', { name: 'Restaurer' }).click();
  await expect(page.getByText(titreModifie)).toBeHidden();

  await page.getByRole('link', { name: 'Notes' }).click();
  await expect(page.getByText(titreModifie)).toBeVisible();
});

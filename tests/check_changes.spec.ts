import { test, expect } from '@playwright/test';

// Hier konfigurieren wir die Zugangsdaten für diesen spezifischen Test
test.use({
  httpCredentials: {
    username: 'opensite', // Hier User für .htaccess eintragen
    password: 'lgz9d76dq1n',     // Hier Passwort für .htaccess eintragen
  },
});

test('Menü öffnen und auf visuelle Veränderungen prüfen', async ({ page }) => {
  // 1. Seite aufrufen (Login passiert automatisch durch test.use oben)
  await page.goto('https://opensite-stage.c-1795.maxcluster.net/');

  // 2. Den Button finden und klicken
  // Wir nutzen hier die Klasse aus deinem Code-Schnipsel, das ist sehr präzise.
  // Alternativ ginge auch: page.getByLabel('expand menu')
  await page.locator('.header__menu--toggle').click();

  // 3. Warten, bis das Menü (das Ziel #flyout) wirklich sichtbar ist
  // Das ist wichtig, damit die Animation fertig ist, bevor der Screenshot kommt.
  const flyoutMenu = page.locator('#flyout');
  await expect(flyoutMenu).toBeVisible();

  // 4. Der Visual Check
  // Dies macht einen Screenshot der GANZEN Seite mit offenem Menü
  // und vergleicht ihn mit der Referenz.
  await expect(page).toHaveScreenshot('menu-open-state.png', {
    fullPage: true, 
    animations: 'disabled' // Versucht CSS Animationen zu stoppen für stabilere Tests
  });
});

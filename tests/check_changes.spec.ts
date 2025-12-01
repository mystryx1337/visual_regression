import { test, expect } from '@playwright/test';

// Hier konfigurieren wir die Zugangsdaten für diesen spezifischen Test
test.use({
  httpCredentials: { username: 'opensite', password: 'lgz9d76dq1n' },
  viewport: { width: 1280, height: 800 }, 
});

// --- TEST 1: Nur das geöffnete Menü prüfen ---
test('Menü öffnen und auf visuelle Veränderungen prüfen', async ({ page }) => {
  // 1. Seite aufrufen (Login passiert automatisch durch test.use oben)
  await page.goto('https://opensite-stage.c-1795.maxcluster.net/');
  
  // Videos Unsichtbar machen, Platz behalten (sicherer für Layouts)  SONST SCHEITERN DIE TESTS
  await page.addStyleTag({ content: 'video { visibility: hidden !important; }' });
  
  // Consent klicken, CTA entfernen
  const consentBtn = page.locator('.brlbs-btn-accept-all');
  if (await consentBtn.isVisible()) {
      await consentBtn.click();
  }
  try {
    await page.locator('#interactive-close-button').click({ timeout: 5000 });
  } catch (error) {
    console.log('Kein Interactive-Close-Button gefunden - Test läuft weiter.');
  }
  
  // Menue-Button finden und klicken
  await page.locator('.header__menu--toggle').click();

  // 3. Warten, bis das Menü (das Ziel #flyout) wirklich sichtbar ist
  // Das ist wichtig, damit die Animation fertig ist, bevor der Screenshot kommt.
  const flyoutMenu = page.locator('#flyout');
  await expect(flyoutMenu).toBeVisible();
  
  // 4. Der Visual Check
  // Dies macht einen Screenshot der GANZEN Seite mit offenem Menü
  // und vergleicht ihn mit der Referenz.
  await expect(flyoutMenu).toHaveScreenshot('menu-element-only.png', {
    animations: 'disabled',
    timeout: 15000,
    caret: 'hide',
    // Optional: Ein kleines Padding (Rand) um das Element herum aufnehmen
    // scale: 'css', 
  });
});

test('Produktdetailseite: Prüfen ob Preisbox und Bild stimmen', async ({ page }) => {
  // 1. Direkt zur zweiten Seite navigieren (Login ist schon durch test.use erledigt)
  // Ändere die URL hier zu der Seite, die du testen willst
  await page.goto('https://opensite-stage.c-1795.maxcluster.net/beispiel-produkt');

  // 2. Wieder Aufräumen (Da neuer Test = neuer Context)
  await page.addStyleTag({ content: 'video { visibility: hidden !important; }' });
  await page.locator('.brlbs-btn-accept-all').click();
  // Das Popup kommt vielleicht auch hier? Sicherheitshalber drin lassen:
  try {
    await page.locator('#interactive-close-button').click({ timeout: 5000 }); 
  } catch (error) {
    console.log('Kein Interactive-Close-Button (Test 2) - weiter gehts.');
  }
  
  // 3. Der Visual Check - GANZE SEITE
  await expect(page).toHaveScreenshot('product-full-page.png', {
    fullPage: true, 
    animations: 'disabled',
    timeout: 20000, // Etwas mehr Zeit für FullPage Screenshots
    caret: 'hide'
  });
});

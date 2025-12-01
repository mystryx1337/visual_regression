import { test, expect } from '@playwright/test';

// Hier konfigurieren wir die Zugangsdaten für diesen spezifischen Test
test.use({
  httpCredentials: { username: 'opensite', password: 'lgz9d76dq1n' },
  viewport: { width: 1280, height: 800 }, 
});

// --- TEST 1: Nur das geöffnete Menü prüfen ---
test('Startseite: Menü öffnen und NUR das Menü-Element visuell prüfen', async ({ page }) => {
  await page.goto('https://opensite-stage.c-1795.maxcluster.net/');
  
  // --- AUFRÄUMEN (WICHTIGSTE ÄNDERUNG) ---
  // Wir blenden Video UND den Cookie-Banner (inkl. Backdrop) hart aus.
  // Das verhindert Klick-Probleme und macht die Tests viel schneller.
  await page.addStyleTag({ 
    content: `
      video { visibility: hidden !important; }
      #BorlabsCookieBox, .brlbs-cmpnt-dialog-backdrop { display: none !important; }
    ` 
  });
  
  // Optionaler Close-Button (falls der noch stört)
  try {
    const closeBtn = page.locator('#interactive-close-button');
    if (await closeBtn.isVisible()) {
       await closeBtn.click({ timeout: 2000 });
    }
  } catch (error) {
    console.log('Kein Interactive-Close-Button (Test 1) - weiter gehts.');
  }
  
  // Jetzt ist der Weg frei für den Klick
  await page.locator('.header__menu--toggle').click();

  const flyoutMenu = page.locator('#flyout');
  await expect(flyoutMenu).toBeVisible();
  
  await expect(flyoutMenu).toHaveScreenshot('menu-element-only.png', {
    animations: 'disabled',
    timeout: 15000,
    caret: 'hide',
  });
});

// --- TEST 2: Ganze Produktseite prüfen ---
test('Produktdetailseite: Gesamte Seite visuell prüfen', async ({ page }) => {
  await page.goto('https://opensite-stage.c-1795.maxcluster.net/beispiel-produkt'); // URL ANPASSEN!

  // Auch hier: Banner hart ausblenden
  await page.addStyleTag({ 
    content: `
      video { visibility: hidden !important; }
      #BorlabsCookieBox, .brlbs-cmpnt-dialog-backdrop { display: none !important; }
    ` 
  });
  
  try {
     const closeBtn = page.locator('#interactive-close-button');
     if (await closeBtn.isVisible()) {
        await closeBtn.click({ timeout: 2000 });
     }
  } catch (error) {
    console.log('Kein Interactive-Close-Button (Test 2) - weiter gehts.');
  }
  
  await page.waitForLoadState('networkidle').catch(() => {});

  await expect(page).toHaveScreenshot('product-full-page.png', {
    fullPage: true, 
    animations: 'disabled',
    timeout: 20000,
    caret: 'hide'
  });
});

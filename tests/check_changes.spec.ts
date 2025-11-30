import { test, expect } from '@playwright/test';

test('Prüfe Startseite auf visuelle und inhaltliche Änderungen', async ({ page }) => {
  // 1. Gehe zur URL (die Live-URL oder eine Staging-URL)
  await page.goto('https://www.ihre-webseite.de');

  // 2. Inhaltliche Prüfung: Stimmt der Haupttitel noch?
  await expect(page.locator('h1')).toHaveText('Willkommen bei uns');

  // 3. Visuelle Prüfung: Hat sich das Design der gesamten Seite verändert?
  // Beim ersten Ausführen erstellt Playwright ein Referenzbild.
  // Bei jedem weiteren Mal vergleicht es den Ist-Zustand damit.
  await expect(page).toHaveScreenshot('homepage-design.png', { 
    fullPage: true, // Screenshot der ganzen Seite, auch was man scrollen muss
    maxDiffPixels: 100 // Erlaubt minimale Abweichungen (Rauschen)
  });

  // 4. Visuelle Prüfung eines bestimmten Elements (z.B. Footer)
  const footer = page.locator('footer');
  await expect(footer).toHaveScreenshot('footer-component.png');
});

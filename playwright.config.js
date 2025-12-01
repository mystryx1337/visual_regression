import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests', // Wo liegen deine Tests?
  // Erstellt immer einen HTML Report im Ordner playwright-report
  reporter: [['html', { open: 'never' }]], 
  
  use: {
    // Speichert bei Fehler auch einen Trace (Video-ähnlich)
    trace: 'on-first-retry', 
    // Speichert Screenshots nur bei Fehler
    screenshot: 'only-on-failure', 
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

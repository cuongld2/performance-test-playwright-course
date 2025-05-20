import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('');

  const navigationLocator = page.locator('[id="nava"]');

  const durationCheck = process.env.Duration;
  if (!durationCheck) {
    throw new Error('Duration environment variable is not set');
  }

  // Expect a title "to contain" a substring.
  await expect(navigationLocator).toBeVisible();
  const response = await page.waitForResponse((response) => response.url().includes("/entries"));
    
     // Assert the response status and body
     const responseBody = await response.json();
     expect(response.status()).toBe(200);
  const entryTypes = ["navigation", "resource", "paint", "mark", "measure", "element", "event", "largestcontentfulpaint", "layout-shift", "taskattribution", 
    "long-animation-frame"
  ];
  for (const entryType of entryTypes) {
    const entriesJson = await page.evaluate((type) =>
      JSON.stringify(performance.getEntriesByType(type))
    , entryType);
    const entries = JSON.parse(entriesJson);
    entries.forEach((entry: any) => {
      console.log(`${entryType.charAt(0).toUpperCase() + entryType.slice(1)} Entry: ${entry.name}`);
      console.log(`Start Time: ${entry.startTime}`);
      console.log(`Duration: ${entry.duration}`);
      expect(entry['duration']).toBeLessThan(Number(durationCheck)); // 2 seconds
    });
  }
  });


const puppeteer = require('puppeteer');
const path = require('path');

const screenshots = [
  { id: 'shot-1', output: 'appstore-1-convert.png' },
  { id: 'shot-2', output: 'appstore-2-tools.png' },
  { id: 'shot-3', output: 'appstore-3-pages.png' },
  { id: 'shot-4', output: 'appstore-4-compress.png' },
  { id: 'shot-5', output: 'appstore-5-watermark.png' },
  { id: 'shot-6', output: 'appstore-6-privacy.png' },
];

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const htmlPath = path.resolve(__dirname, 'index.html');
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

  for (const shot of screenshots) {
    const element = await page.$(`#${shot.id}`);
    if (!element) {
      console.log(`Element #${shot.id} not found, skipping`);
      continue;
    }

    // Remove the transform scale so we capture at full 2560x1600
    await page.evaluate((id) => {
      const el = document.getElementById(id);
      el.style.transform = 'none';
    }, shot.id);

    const outputPath = path.resolve(__dirname, shot.output);
    await element.screenshot({ path: outputPath });
    console.log(`Saved: ${shot.output}`);

    // Restore scale
    await page.evaluate((id) => {
      const el = document.getElementById(id);
      el.style.transform = 'scale(0.25)';
    }, shot.id);
  }

  await browser.close();
  console.log('Done! All screenshots saved.');
})();

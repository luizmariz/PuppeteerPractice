const puppeteer = require('puppeteer');

const URL = 'https://medium.com/search?q=angular';

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto( URL );

    while(true) {
      await page.evaluate( () => {
        window.scrollBy(0, window.innerHeight);
      });
    }

  await browser.close();
})();

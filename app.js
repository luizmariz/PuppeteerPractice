const puppeteer = require('puppeteer');

const URL = 'https://medium.com/search?q=angular';

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            const totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 600);
        });
    });
};

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto( URL );

  await autoScroll(page);

  await page.screenshot({
      path: 'yoursite.png',
      fullPage: true
  });

  await browser.close();
})();

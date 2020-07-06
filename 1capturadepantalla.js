const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox', "--disable-gpu", '--start-maximized'],
    ignoreHTTPSErrors: true,
    headless: false,
    slowMo: 100
  });

  const page = await browser.newPage();
  await page.goto('https://www.iprospect.com/es/cl/about-us/our-team/');

  await page.setViewport({
    width: 1280,
    height: 800
  })

  await page.screenshot({
    path: 'google.png',
    fullPage: true
  });


  browser.close();
})();

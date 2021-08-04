const puppeteer = require('puppeteer');

const target = 'https://db.netkeiba.com/race/202109030411/';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(target);
    
    await browser.close();
})();
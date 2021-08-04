const puppeteer = require('puppeteer');

const target = 'https://db.netkeiba.com/race/202109030411/';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(target);
    const raseResultTable = await page.$x('//*[@id="contents_liquid"]/table');
    const rows = await raseResultTable[0].$$('tr');
    for(const row of rows) {
        console.log((await (await row.getProperty('textContent')).jsonValue()).split('\n').join(','));
    }
    await browser.close();
})();
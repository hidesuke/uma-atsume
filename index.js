const puppeteer = require('puppeteer');
const keibaResult = require('./keiba/result');
const keibaRace = require('./keiba/race');

const target = 'https://db.netkeiba.com/race/202109030411/';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(target);
    // const results = await keibaResult.getAsArray(page);
    // await showOnConsole(results);
    // outputAsCsv(results);
    const raceInfo = await keibaRace.getAsArray(page);
    console.log(raceInfo);
    await browser.close();
})();

const outputAsCsv = (umaData) => {
    // コンソールにカンマ区切りで出力する
    for (const uma of umaData) {
        console.log(uma.join(','));
    }
};

const showOnConsole = async (wantToSee) => {
    console.log(wantToSee);
};
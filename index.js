const fs = require('fs');
const puppeteer = require('puppeteer');
const keibaResult = require('./keiba/result');
const keibaRace = require('./keiba/race');

const RACE_URL_BASE = 'https://db.netkeiba.com/race/';


(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await crawlRaceResult(page);

    await browser.close();
})();

const sleep = (delay) => {
    return new Promise(resolve => setTimeout(resolve, delay));
}

const crawlRaceResult = async (page) => {
    /**
     * RaceIdの構成
     * 西暦/馬場/n回開催/m日目/第l競争
     * [馬場] 01:札幌,02:函館,03:福島,04:新潟,05:東京,06:中山,07:中京,08:京都,09:阪神,10:小倉
     */
    const races = [];
    let results = [];
    let daySkipFlag = false;
    let kaiSkipFlag = false;
    for (let year = 2020; year < 2021; year++) {
        for (let place = 1; place < 11; place++) {
            for (let kai = 1; kai < 6; kai++) {
                for (let day = 1; day < 13; day++) {
                    for (let race = 1; race < 13; race++) {
                        const raceId = `${year}${('00' + place).slice(-2)}${('00' + kai).slice(-2)}${('00' + day).slice(-2)}${('00' + race).slice(-2)}`;
                        const url = `${RACE_URL_BASE}${raceId}/`;
                        console.log(url);
                        await page.goto(url);

                        // データ存在確認
                        const raceInfoSelector = 'div.mainrace_data';
                        const raceInfoDom = await page.$(raceInfoSelector);
                        if (!raceInfoDom) {
                            console.log(`${url} does not exists`);
                            if (race === 1) daySkipFlag = true;
                            break;
                        }

                        races.push(await keibaRace.getAsArray(page));
                        results = [...results, ...(await keibaResult.getAsArray(page))];
                        await sleep(500);
                    }
                    // 1レース目が存在しない場合はその日以降は存在しないのでスキップ
                    if (daySkipFlag) {
                        daySkipFlag = false;
                        if (day === 1) kaiSkipFlag = true;
                        break;
                    }
                }
                // 1日目が存在しない場合はそれ以降の回は存在しないのでスキップ
                if (kaiSkipFlag) {
                    kaiSkipFlag = false;
                    break;
                }
            }
        }
    }
    writeToFile('race.csv', array2dToCsv(races));
    writeToFile('race_result.csv', array2dToCsv(results));
};

const writeToFile = (file, data) => {
    try {
        fs.writeFileSync(file, data)
    } catch (e) {
        console.error(e);
    }
};

const array2dToCsv = (array2d) => {
    let csv = '';
    for (const array of array2d) {
        csv += array.join(',') + '\n';
    }
    return csv;
};

const showOnConsole = async (wantToSee) => {
    console.log(wantToSee);
};
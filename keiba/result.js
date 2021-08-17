const getAsArray = async (page) => {
    const raceResults = await getRaceResults(page);
    raceResults.shift(); // remove table header
    const results = [];
    for (const result of raceResults) {
        results.push(await umahashiraToArray(result));
    }
    return results;
}

const getRaceResults = async (page) => {
    const raceResultTable = await page.$x('//*[@id="contents_liquid"]/table');
    return await raceResultTable[0].$$('tr');
};

const umahashiraToArray = async (umahashira) => {
    /**
    [元データのテーブル構成]
    0: 着順
    1: 枠番
    2: 馬番
    3: 馬名 (リンク有り/馬IDを取得する)
    4: 性齢
    5: 斤量
    6: 騎手 (リンク有り/騎手IDを取得する)
    7: タイム
    8: 着差 (1着は空)
    9: ﾀｲﾑ指数 (不要)
    10: 通過
    11: 上り
    12: 単勝
    13: 人気
    14: 馬体重
    15: 調教ﾀｲﾑ (不要)
    16: 厩舎ｺﾒﾝﾄ (不要)
    17: 備考 (不要)
    18: 調教師 (リンク有り)
    19: 馬主 (リンク有り)
    20: 賞金(万円) (不要)
     */
    const retArray = [];
    const GETTING_ID_FROM_LINK_INDEXES = [3, 6, 18];
    const IGNORE_INDEXES = [9, 15, 16, 17, 20]
    const cells = await umahashira.$$('td');
    for (let i = 0, len = cells.length; i < len; i++) {
        if (IGNORE_INDEXES.includes(i)) continue;
        if (GETTING_ID_FROM_LINK_INDEXES.includes(i)) {
            const anchorTag = await cells[i].$('a');
            const link = await (await anchorTag.getProperty('href')).jsonValue();
            const id = link.trim().split('/').slice(-2, -1)[0];
            retArray.push(id);
        }
        const textData = await (await cells[i].getProperty('textContent')).jsonValue()
        retArray.push(textData.trim().replace('\n', ''));
    }
    /**
    [出力のデータ構成]
    0: 着順
    1: 枠番
    2: 馬番
    3: 馬ID
    4: 馬名
    5: 性齢
    6: 斤量
    7: 騎手ID
    8: 騎手 
    9: タイム
    10: 着差 (1着は空)
    11: 通過
    12: 上り
    13: 単勝
    14: 人気
    15: 馬体重
    16: 調教師ID
    17: 調教師
    18: 馬主
     */
    return retArray;
};

module.exports = {
    getAsArray,
};
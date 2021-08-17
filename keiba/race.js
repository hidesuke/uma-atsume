

const getAsArray = async (page) => {
    const id = await getId(page);
    const place = await getPlace(page);
    const number = await getNumber(page);
    const name = await getName(page);
    const [course, weather, courseKind, courseCondition, distance] = await getConditions(page);
    const [date, raceKinds] = await getDetail(page);
    return [
        id,
        date,
        raceKinds,
        place,
        number,
        name,
        course,
        distance,
        courseKind,
        courseCondition,
        weather,
    ];
};

const getId = async (page) => {
    const url = await page.url();
    return url.split('/').slice(-2, -1)[0];
}

const getTextBySelector = async (page, selector) => {
    const dom = await page.$(selector);
    return (await (await dom.getProperty('textContent')).jsonValue()).trim();
}

const getPlace = async (page) => {
    const placeSelector = 'ul.race_place > li > a.active';
    return await getTextBySelector(page, placeSelector);
}

const getNumber = async (page) => {
    const numberSelector = 'dl.racedata > dt';
    return await getTextBySelector(page, numberSelector);
}

const getName = async (page) => {
    const nameSelector = 'dl.racedata > dd > h1';
    return await getTextBySelector(page, nameSelector);
}

const getConditions = async (page) => {
    const conditionSelector = 'dl.racedata > dd > p > diary_snap_cut > span';
    const conditionsText = await getTextBySelector(page, conditionSelector);
    const conditions = conditionsText.split('/').map(x => x.trim());
    const weather = conditions[1].split(':')[1].trim();
    const [courseKind, courseCondition] = conditions[2].split(':').map(x => x.trim());
    const distance = conditions[0].match(/\d+/)[0];
    return [conditions[0], weather, courseKind, courseCondition, distance];
};

const getDetail = async (page) => {
    const detailSelector = 'div.data_intro > p';
    const detailText = await getTextBySelector(page, detailSelector);
    const details = detailText.split(' ');
    const date = details[0].trim();
    const raceKinds = details[2].split(/\s+/g)[1];
    return [date, raceKinds];
}

module.exports = {
    getAsArray,
};
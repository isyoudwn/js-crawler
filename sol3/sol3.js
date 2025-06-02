import fs from 'fs';
import * as cheerio from 'cheerio';

const BASE_URL = "https://search.daum.net/search?w=news&nil_search=btn&DA=NTB&enc=utf8&cluster=y&cluster_page=1&q=%EA%B8%88%EC%9C%B5+%EC%84%9C%EB%B9%84%EC%8A%A4";
const script = [];


const getResposne = async (seletedContents) => {
    for (let i = 0; i < seletedContents.length; i++) {
        const content = seletedContents.eq(i);
        const newsUri = content.find('a').attr('href');
        if (newsUri === "javascript:;") {
            continue;
        }
        const newsId = newsUri.replace('http://v.daum.net/v/', '');
        const newsDetail = await fetch(newsUri);
        const result = await newsDetail.text();
        fs.writeFileSync(`./results/${newsId}.html`, result, null, 2);
    }
};

const main = async () => {
    const response = await fetch(BASE_URL);
    const body = await response.text();
    const $ = cheerio.load(body);
    const seletedContents = $('.c-item-content');
    await getResposne(seletedContents);
};

main();

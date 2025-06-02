import fs from 'fs';
import * as cheerio from 'cheerio';

const BASE_URL = "https://search.daum.net/search?w=news&nil_search=btn&DA=NTB&enc=utf8&cluster=y&cluster_page=1&q=%EA%B8%88%EC%9C%B5+%EC%84%9C%EB%B9%84%EC%8A%A4";
const script = [];

const getResposne = async (next) => {
    const response = await fetch(BASE_URL + `&p=${next}`);
    const body = await response.text();
    const $ = cheerio.load(body);

    const seletedContents = $('.c-item-content');
    const seletedTitle = $('.c-tit-doc');

    for (let i = 0; i < seletedContents.length; i++) {
        const content = seletedContents.eq(i);
        const titleContent = seletedTitle.eq(i);

        const title = content.find('.item-title').text().trim();
        const body = content.find('a').text().trim();
        const date = content.find('.txt_info').text().trim();
        const news = titleContent.find('.txt_info').text().trim();
        const newsUri = content.find('a').attr('href');
        const img = content.find('.wrap_thumb img').attr('data-original-src') ||
            '';

        if (title === '' || body === '') continue;

        script.push({ news, title, body, date, newsUri, img });
    }
};

const main = async () => {
    const tasks = [];
    for (let i = 2; i <= 3; i++) {
        tasks.push(await getResposne(i));
    }

    fs.writeFileSync("./result2.json", JSON.stringify(script, null, 2));
};

main();

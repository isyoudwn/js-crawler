import fs from 'fs';
import * as cheerio from 'cheerio';
import iconv from 'iconv-lite';

const BASE_URL = "https://finance.naver.com/item/news_notice.naver?code=005930&page=";
const DOMAIN = "https://finance.naver.com/"
const disclosure = [];

const getResposne = async (id) => {
    const response = await fetch(BASE_URL + `&${id}`, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        },
    });

    // 한글 깨짐 수정
    const buffer = await response.arrayBuffer();
    const body = iconv.decode(Buffer.from(buffer), 'euc-kr');
    const $ = cheerio.load(body);

    const selectedTableRow = $('.type6 tr');

    for (let i = 1; i < selectedTableRow.length; i++) {
        const title = selectedTableRow.eq(i).find('.title').text();
        const info = selectedTableRow.eq(i).find('.info').text();
        const date = selectedTableRow.eq(i).find('.date').text();
        const uri = selectedTableRow.eq(i).find('.title a').attr('href');

        disclosure.push({ title, info, date, uri: `${DOMAIN}${uri}${id}` });
    }
};

const main = async () => {
    await getResposne(1);
    fs.writeFileSync("./result5.json", JSON.stringify(disclosure, null, 2));

}

main();

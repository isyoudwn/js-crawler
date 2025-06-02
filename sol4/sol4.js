import fs from 'fs';
import * as cheerio from 'cheerio';
import iconv from 'iconv-lite';

const BASE_URL = "https://finance.naver.com/item/sise_day.naver?code=005930&page=";
const stockData = [];

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

    const seletedRow = $('tbody tr');

    for (let i = 2; i < seletedRow.length; i++) {
        const tableData = seletedRow.eq(i).find('td');

        if (tableData.length != 7) {
            continue;
        }

        const date = tableData.eq(0).text().trim();
        const endPrice = tableData.eq(1).text().trim();
        const compareStatus = tableData.eq(2).find('.blind').text();
        const compareNumber = tableData.eq(2).find('.tah').text().trim();
        const marketPrice = tableData.eq(3).text().trim();
        const highestCost = tableData.eq(4).text().trim();
        const lowestCost = tableData.eq(5).text().trim();
        const tradingVolume = tableData.eq(6).text().trim();

        stockData.push({ date, endPrice, compareStatus, compareNumber, marketPrice, highestCost, lowestCost, tradingVolume })
    }
};

const main = async () => {
    await getResposne(1);
    fs.writeFileSync("./result4.json", JSON.stringify(stockData, null, 2));
};

main();

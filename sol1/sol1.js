import fs from 'fs';
import * as cheerio from 'cheerio';

const BASE_URL = "https://quotes.toscrape.com";
const quotes = [];

/**
 * 명언을 가져온다
 * @param {string} uri 
 * @returns 
 */
const getQuote = async (uri) => {
    const response = await fetch(BASE_URL + uri);
    const body = await response.text();
    const $ = cheerio.load(body);

    const seletedQuote = $('.quote');

    for (let i = 0; i < seletedQuote.length; i++) {
        const quoteSeleted = seletedQuote.eq(i);
        const author = quoteSeleted._findBySelector(".author").text();
        const quote = quoteSeleted._findBySelector(".text").text();

        const tagsSeleted = quoteSeleted._findBySelector(".tags .tag");
        const tags = [];

        for (let j = 0; j < tagsSeleted.length; j++) {
            tags.push(tagsSeleted.eq(j).text());
        }

        const authorAboutUri = quoteSeleted.find('.author').next('a').attr('href');
        const about = await getAbout(BASE_URL + authorAboutUri)
        quotes.push({ quote, tags, author, about });
    }

    const nextUri = $('.pager .next a').attr('href');
    if (!nextUri) {
        return quotes;
    }

    return getQuote(nextUri);
}

/**
 * Author의 설명을 가져온다
 * @param {string} aboutUri 
 * @returns {about}
 */
const getAbout = async (aboutUri) => {
    const response = await fetch(aboutUri);

    const body = await response.text();
    const $ = cheerio.load(body);

    const description = $('.author-description').text().trim();
    const bornDate = $('.author-born-date').text().trim();
    const bornLocation = $('.author-born-location').text().trim();

    return { description, bornDate, bornLocation };
}


const getQuoteResult = await getQuote('');


/**
 * 파일에 작성
 */
fs.writeFileSync("./result1.json", JSON.stringify(getQuoteResult, null, 2));

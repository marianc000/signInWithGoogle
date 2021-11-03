import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { env } from 'process';

if (!env.GUSER || !env.GPASS) throw 'Set GUSER and GPASS';

puppeteer.use(StealthPlugin());

const browser = await puppeteer.launch({ headless: false });
const page = await browser.newPage();

await page.setExtraHTTPHeaders({
    'accept-language': 'en-US,en;q=0.9,hy;q=0.8'
});

await page.goto('https://medium.com/m/connect/google?state=google-%7Chttps%3A%2F%2Fmedium.com%2F');

await page.waitForSelector('input[type="email"]')
await page.type('input[type="email"]', env.GUSER);

await Promise.all([
    page.waitForNavigation(),
    await page.keyboard.press('Enter')
]);

await page.waitForSelector('input[type="password"]', { visible: true });
await page.type('input[type="password"]', env.GPASS);

const res = await Promise.all([
    page.waitForFunction(() => location.href === 'https://medium.com/'),
    await page.keyboard.press('Enter')
]);

// print user id
await page.waitForFunction(() => window?.branch?.g);
const myId = await page.evaluate(() => window.branch.g);
console.log("myId:", myId);

await browser.close();
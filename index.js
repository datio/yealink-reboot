import { chromium } from 'playwright';
import { getDevices } from './lib/config.js';

const devices = getDevices();

const login = async (page, username, password) => {
    await page.waitForSelector('#idUsername');
    await page.waitForSelector('#idPassword');
    await page.fill('#idUsername', username);
    await page.fill('#idPassword', password);
    await page.click('#idLogin');
};

const gotoUpgrade = async (page) => {
    await page.waitForSelector('#app-menu');
    await page.click('text=Settings');
    await page.waitForSelector('text=Upgrade');
    await page.click('text=Upgrade');
};

const clickRebootAndConfirm = async (page) => {
    await page.waitForSelector('button:has-text("Reboot")');
    await page.click('button:has-text("Reboot")');
    await page.waitForSelector('.ivu-modal-body span:text("OK")');
    await page.click('.ivu-modal-body span:text("OK")');
};

const listenStatusRequests = (page, url) => {
    const apiUrl = `${url.replace(/\/$/, '')}/api/common/info/status/talking`;
    page.on('requestfinished', async (request) => {
        if (request.url().startsWith(apiUrl) && request.method() === 'GET') {
            try {
                const response = await request.response();
                const body = await response.text();
                const json = JSON.parse(body);
                if (json.ret === 'ok' && json.data === true) {
                    console.log(`[${url}] One or more handsets are currently in use (talking). Reboot will not proceed.`);
                } else if (json.ret === 'ok' && json.data === false) {
                    console.log(`[${url}] No handsets in use. Rebooting...`);
                } else {
                    console.log(`[${url}] Unexpected API response:`, body);
                }
            } catch (err) {
                console.error(`[${url}] Error parsing API response:`, err);
            }
        }
    });
};

(async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({ ignoreHTTPSErrors: true });

    await Promise.all(devices.map(async ({ url, username, password }) => {
        const page = await context.newPage();
        await page.goto(url);

        await login(page, username, password);
        await gotoUpgrade(page);
        listenStatusRequests(page, url);
        await clickRebootAndConfirm(page);

        return page;
    }));

    browser.on('disconnected', () => process.exit(0));
})();
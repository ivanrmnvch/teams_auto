const puppeteer = require('puppeteer');
const scripts = require('./scripts');
const Downloader = require("nodejs-file-downloader");

(async () => {
  const browser = await puppeteer.launch({
    devtools: false,
    defaultViewport: {
      width: 1920,
      height: 1024,
    },
    headless: false,
  });

  await scripts.auth(browser);
  const page = await scripts.openTeams(browser);
  // await scripts.requestInterception(page);
  // await scripts.getMenu(browser);

  console.log(1);

  const client = await page.target().createCDPSession()
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: '/home/ivanrmnvch/homework/diss2/downloads',
  })

  page.evaluate((url) => {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();
  }, 'https://ystu.sharepoint.com/sites/-45986/_layouts/15/download.aspx?UniqueId=22f9c6d2%2D778b%2D4450%2Dbbaf%2Dab887677da2b');


  console.log(2);

  // await browser.close();
})();
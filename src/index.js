const puppeteer = require('puppeteer');
const config = require('../config/config.json');

(async () => {
  const browser = await puppeteer.launch({
    devtools: false,
    defaultViewport: {
      width: 1920,
      height: 1024,
    },
    headless: false,
  });


  const loginPage = await browser.newPage();
  await loginPage.goto('https://login.microsoftonline.com/', { waitUntil: 'networkidle0' });

  try {
    await loginPage.type('#i0116', config.email);
    await loginPage.click('[id=idSIButton9][value=Далее]');
    await loginPage.type('#i0118', config.pass);
    await loginPage.waitForSelector('[id=idSIButton9][value=Войти]');
    await loginPage.click('[id=idSIButton9][value=Войти]');
    await loginPage.waitForNavigation({ waitUntil: 'networkidle0' });
    await loginPage.close();
  } catch (e) {
    console.log(e);
  }

  const teamsPage = await browser.newPage();
  await teamsPage.goto('https://teams.microsoft.com/')

  // await browser.close();
})();
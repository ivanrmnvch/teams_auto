const config = require('../../config/config.json');

module.exports = {
  auth: async (browser) => {
    try {
      const loginPage = await browser.newPage();
      await loginPage.goto('https://login.microsoftonline.com', { waitUntil: 'networkidle0' });
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
  },
  requestInterception: async (page) => {
    console.log(1);
    await page.setRequestInterception(true);
    page.on('request', (interceptedRequest) => {

      console.log('url', interceptedRequest.url());
      // Check the URL or content type to detect a download request
      if (interceptedRequest.url().endsWith('.pdf') ||
      interceptedRequest.url().endsWith('.jpg')) {
        // Handle the download here...
      }
      interceptedRequest.continue();
    });
  },
  openTeams: async (browser) => {
    const teamsPage = await browser.newPage();
    await teamsPage.goto('https://teams.microsoft.com', { waitUntil: 'networkidle0' });
    await teamsPage.waitForSelector('#channel-list-favorites-section-selectable-header');
    return teamsPage;
  },
  getMenu: async (browser) => {
    const teamsPage = await browser.newPage();
    await teamsPage.goto('https://teams.microsoft.com', { waitUntil: 'networkidle0' });

    await teamsPage.waitForSelector('#channel-list-favorites-section-selectable-header');

    const listLength = await teamsPage.$eval('#channel-list-favorites-section-selectable-header > ul', (list) => (list.children.length));

    // -1 первый элемент в DOM дереве лишний, его нужно пропустить
    // +2 в DOM дереве счет начинается с единицы, для пропуска первого элемента прибавляем 2
    const teamId = new Array(listLength - 1).fill(null).map((el, index) => (listLength - listLength + index + 2));

    const menu = [];

    for await (const id of teamId) {
      const title = await teamsPage.$eval(
        `#channel-list-favorites-section-selectable-header > ul > li:nth-child(${id}) > div > h3 > a > div > div > span`,
        (el) => el.title,
      );
      const selector = `#channel-list-favorites-section-selectable-header > ul > li:nth-child(${id})`;
      await teamsPage.click(selector);
      const options = await teamsPage.$$eval(
        `#channel-list-favorites-section-selectable-header > ul > li:nth-child(${id}) > div > div > ul > ng-include > li`,
        (options, id) => options.map((option, index) => ({
          id: index + 1,
          title: option.innerText,
          selector: `#channel-list-favorites-section-selectable-header > ul > li:nth-child(${id}) > div > div > ul > ng-include > li:nth-child(${index + 1})`,
        })),
        id,
      );
      menu.push({
        id,
        title,
        selector,
        options,
      });
    }
    return menu;
  },
};
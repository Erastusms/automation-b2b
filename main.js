const puppeteer = require("puppeteer");
const { clickElementByXPath } = require("./utils");
const { URL_B2B, selectorList } = require("./constant");
const { login } = require("./login");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    args: ["--start-maximized"],
  });
  const page = await browser.newPage();
  const pages = await browser.pages();
  if (pages.length > 1) {
    await pages[0].close();
  }

  await page.goto(URL_B2B);
  await Promise.all([
    page.evaluate(clickElementByXPath, selectorList.XPathBtnTextLogin),
    page.waitForNavigation(),
  ]);

  const testLogin = await login(page);
  console.log(`durasi login : ${testLogin}`);

  //   await browser.close();
})();

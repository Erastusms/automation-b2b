const puppeteer = require("puppeteer");
const { clickElementByXPath } = require("./utils");
const { URL_B2B, selectorList } = require("./constant");

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

  // XPath yang ingin Anda klik
  // const xpathToClick =
  //   '//*[@id="ctl00_panelWebsiteWidth"]/table/tbody/tr[1]/td/table/tbody/tr/td/table/tbody/tr[2]/td/table/tbody/tr/td[2]/table/tbody/tr[1]/td[1]/a';

  // Mengeksekusi fungsi untuk mengevaluasi dan mengklik XPath
  const clicked = await page.evaluate(
    clickElementByXPath,
    selectorList.XPathBtnTextLogin
  );

  if (clicked) {
    console.log("Elemen berhasil diklik.");
  } else {
    console.log("Elemen tidak ditemukan.");
  }

  //   await browser.close();
})();

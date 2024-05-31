const puppeteer = require("puppeteer");
const { clickElementByXPath } = require("./utils");
const { URL_B2B, selectorList } = require("./constant");
const { login } = require("./login");
const {search} = require("./search");

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

  // await page.type("#txtSearchEngine1", "gsmf");
  // const btnSearch = await page.waitForSelector("#btnSearchEngine1", {
  //   visible: true,
  // });

  // await Promise.all([
  //   btnSearch.click(),
  //   page.waitForNavigation({ waitUntil: "networkidle0" }),
  // ]);

  const testSearch = await search(page);


  const addToCart = await page.waitForSelector("#btnAddToCart_GSMF-GTZ-8V", {
    visible: true,
  });
  await Promise.all([addToCart.click(), page.waitForNavigation()]);

  // let okButton = document.querySelector('button[value="ok"]');

  // const okBtn = await page.waitForSelector(
  //   "#ucModalProductSuccessAdd_ButtonOk > td > input",
  //   { hidden: true }
  // );

  // await okBtn.click();

  // await Promise.all([
  //   page.evaluate(clickElementByXPath, selectorList.XPathBtnOKAddToCart),
  //   page.waitForNavigation(),
  // ]);
  // await page.evaluate(() => {
  //   const okButton = document.querySelector(
  //     "#ucModalProductSuccessAdd_ButtonOk > td > input"
  //   );
  //   page.locator(okButton).click();
  // });

  // Query for an element handle.
  // const element = await page.waitForSelector('tr > td > input.ButtonAction');

  // Do something with element...
  // await element.click();
  // Tangkap peristiwa saat popup muncul
  // page.on("dialog", async (dialog) => {
  //   console.log("Popup muncul:", dialog.message());
  //   // Jika pesan popup sesuai dengan yang Anda harapkan, klik tombol "OK"
  //   if (dialog.message() === "Your expected popup message") {
  //     await dialog.accept(); // Klik tombol "OK"
  //   } else {
  //     await dialog.dismiss(); // Untuk menangani popup dengan cara lain
  //   }
  // });

  //   await browser.close();
})();

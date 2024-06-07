const puppeteer = require("puppeteer");
const { URL, selectorList } = require("./constant");
const { getHtmlData } = require("./utils/generateHtml");
const { loginPage } = require("./pages/loginPage");
const { homePage } = require("./pages/homePage");
const { clickElementByXPath, generatePdf, dateDifference } = require("./utils");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    args: ["--start-maximized"],
  });
  // const browser = await puppeteer.launch();

  const page = await browser.newPage();
  const pages = await browser.pages();
  if (pages.length > 1) {
    await pages[0].close();
  }
  let startDate = new Date();

  try {
    await page.goto(URL.home);
    await Promise.all([
      page.evaluate(clickElementByXPath, selectorList.XPathBtnTextLogin),
      page.waitForNavigation(),
    ]);

    const loginTest = await loginPage(page);
    console.log("loginTest");
    console.log(loginTest);

    const homeTest = await homePage(page);
    console.log("homeTest");
    console.log(homeTest);

    const mergedObject = { ...loginTest, ...homeTest };
    console.log(mergedObject);

    // const imgIconCart = await page.waitForSelector("#imgIconCart", {
    //   visible: true,
    // });

    // await Promise.all([
    //   imgIconCart.click(),
    //   page.waitForNavigation({ waitUntil: "networkidle2" }),
    // ]);

    // pada halaman cart
    // await page.type("#txtPartNumber", "GSMF-GTZ-4V");
    // await page.type("#txtQuantity", "5");

    // const btnAddItem = await page.waitForSelector("#btnAddItem", {
    //   visible: true,
    // });

    // await btnAddItem.click();
    // await waiting(2000);

    // await page.type("#txtPartNumber", "GSMF-GTZ-8V");
    // await page.type("#txtQuantity", "5");

    // await btnAddItem.click();

    // console.log("Waiting for selector...");
    // const btnSelectVoucher = await page.waitForSelector("#btnSelectVoucher", {
    //   visible: true,
    // });

    // console.log("Scrolling to the element...");
    // await page.evaluate(() => {
    //   document
    //     .querySelector("#btnSelectVoucher")
    //     .scrollIntoView({ behavior: "smooth", block: "center" });
    // });

    // console.log("Berhasil scroll element");

    // await waiting(2000);

    // await btnSelectVoucher.click();

    // const btnUseVoucher1 = await page.waitForSelector("#btnUseVoucher1", {
    //   visible: true,
    // });

    // console.log("Scrolling to the element...");
    // await page.evaluate(() => {
    //   document
    //     .querySelector("#btnUseVoucher1")
    //     .scrollIntoView({ behavior: "smooth", block: "center" });
    // });
    // await waiting(2000);

    // await btnUseVoucher1.click();
    // await waiting(1000);

    // console.log("Waiting for selector...");
    // //   const selector = 'input.ButtonAction[value="Ok"]';
    // await page.waitForSelector("#ucModal1_ButtonText", {
    //   visible: true,
    // }); // Waiting for the button to be visible

    // console.log("Clicking the element OK...");
    // await page.click("#ucModal1_ButtonText"); // Clicking the button'

    // console.log("Waiting for selector...");
    // //   const selector = 'input.ButtonAction[value="Ok"]';
    // const selector23 = 'a.fancybox-item.fancybox-close[title="Close"]';
    // const tombolClose = await page.waitForSelector(selector23, {
    //   visible: true,
    // }); // Waiting for the element to be visible
    // // Waiting for the button to be visible

    // await waiting(1000);

    // console.log("Clicking the element tombol close...");
    // await tombolClose.click();

    // await generatePdf(content, ["BRI"], ["Gunakan semua"], ["TESTING123"]);
    let endDate = new Date();
    let dateDiff = await dateDifference(endDate, startDate);

    const htmlResult = await getHtmlData(
      mergedObject,
      startDate.toLocaleString("en-GB", { timeZone: "Asia/Jakarta" }) + " WIB",
      endDate.toLocaleString("en-GB", { timeZone: "Asia/Jakarta" }) + " WIB",
      dateDiff
    );
    
    const pdfFilePath = await generatePdf(htmlResult);
    const BASE_DIRECTORY = "D:/ProjectME/puppeteer-b2b/document/";

    const filename = pdfFilePath.replace(BASE_DIRECTORY, "");
    let attachmentData = { filename, pdfFilePath };
    return attachmentData;
    // await Promise.all([
    //   btnUseVoucher1.click(),
    //   page.waitForNavigation({ waitUntil: "networkidle0" }),
    // ]);

    // const btnTextOK = await page.waitForSelector("#ucModal1_ButtonText", {
    //   visible: true,
    // });

    // await Promise.all([
    //   btnTextOK.click(),
    //   page.waitForNavigation({ waitUntil: "networkidle0" }),
    // ]);
  } catch (err) {
    console.log("error");
    console.log({
      error: err,
    });
  }

  //   await browser.close();
})();

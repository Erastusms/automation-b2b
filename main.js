const puppeteer = require("puppeteer");
const { PuppeteerScreenRecorder } = require("puppeteer-screen-recorder");

const { URL, selectorList } = require("./constant");
const { getHtmlData } = require("./utils/generateHtml");
const { loginPage, homePage, searchPage, cartPage } = require("./pages");
const { clickElementByXPath, generatePdf, dateDifference } = require("./utils");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    args: ["--start-maximized"],
    // slowMo: 100,
  });
  // const browser = await puppeteer.launch();

  const page = await browser.newPage();
  const pages = await browser.pages();
  if (pages.length > 1) {
    await pages[0].close();
  }
  let startDate = new Date();

  try {
    // Start recording.
    // const recorder = new PuppeteerScreenRecorder(page);
    // await recorder.start("./report/video/simple.mp4");
    await page.goto(URL.home);
    await Promise.all([
      page.evaluate(clickElementByXPath, selectorList.XPathBtnTextLogin),
      page.waitForNavigation(),
    ]);

    const loginTest = await loginPage(page);
    // console.log("loginTest");
    // console.log(loginTest);

    const homeTest = await homePage(page);
    // console.log("homeTest");
    // console.log(homeTest);

    const searchTest = await searchPage(page);
    // console.log("searchTest");
    // console.log(searchTest);

    const cartTest = await cartPage(page);
    // console.log("cartTest");
    // console.log(cartTest);

    const mergedObject = { ...loginTest, ...homeTest, ...searchTest, ...cartTest };
    console.log(mergedObject);

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
    // let attachmentData = { filename, pdfFilePath };
    // console.log("attachmentData");
    // console.log(attachmentData);
    // // Stop recording.
    // await recorder.stop();
    // await browser.close();
    // return attachmentData;
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

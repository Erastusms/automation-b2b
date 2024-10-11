const puppeteer = require("puppeteer");
const { PuppeteerScreenRecorder } = require("puppeteer-screen-recorder");

const { URL } = require("./config");
const { selectorList } = require("./constant");
const {
  loginPage,
  homePage,
  searchPage,
  cartPage,
  laporanPage,
} = require("./pages");
const {
  clickElementByXPath,
  dateDifference,
  timeCalc,
  logToFile,
  logger,
  logNode,
  loggerNew,
} = require("./utils");
const { successOrderWithVoucher } = require("./test/scenario-1");
const { getHtmlData } = require("./utils/generateHtml");
const { generatePDF } = require("./utils/generatePdf");
const { emailSender } = require("./utils/emailSender");

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
    let start = performance.now();
    await page.goto(URL.home, { timeout: 0, waitUntil: "networkidle0" });
    let end = performance.now();
    const loginTime = {
      testCase: "Login Time",
      duration: await timeCalc(end, start),
    };
    console.log("waktu login");
    console.log(loginTime);
    logger.log("info", loginTime);
    logNode.Info(loginTime);
    logToFile(loginTime);
    loggerNew.info(loginTime);
    await Promise.all([
      page.evaluate(clickElementByXPath, selectorList.XPathBtnTextLogin),
      page.waitForNavigation(),
    ]);

    // page.on("response", async (response) => {
    //   // console.log(response.url()[0]);
    //   if (response.status() === 200) {
    //     const webURL = response.url();
    //     console.log(`URL: ${webURL}`);
    //   }
    // });

    const loginTest = await loginPage(page);
    // console.log("loginTest");
    // console.log(loginTest);

    // const cartTest = await cartPage(page);
    // console.log("cartTest");
    // console.log(cartTest);

    const homeTest = await homePage(page);
    // console.log("homeTest");
    // console.log(homeTest);

    const searchTest = await searchPage(page);
    // console.log("cartTest");
    // console.log(cartTest);
    // const cartPageCheckSuspended = await cartPageCheckSuspend(page);
    // console.log("cartTest");
    // console.log(cartTest);

    const cartTest = await cartPage(page);
    // console.log("cartTest");
    // console.log(cartTest);

    const laporanTest = await laporanPage(page);
    // console.log("laporanTest");
    // console.log(laporanTest);

    const mergedObject = {
      ...loginTest,
      ...homeTest,
      ...searchTest,
      ...cartTest,
      ...laporanTest,
    };
    // console.log(mergedObject);

    // const createSuccessOrder = await successOrderWithVoucher(page);

    // await generatePdf(content, ["BRI"], ["Gunakan semua"], ["TESTING123"]);
    let endDate = new Date();
    let dateDiff = await dateDifference(endDate, startDate);

    const htmlResult = await getHtmlData(
      mergedObject,
      startDate.toLocaleString("en-GB", { timeZone: "Asia/Jakarta" }) + " WIB",
      endDate.toLocaleString("en-GB", { timeZone: "Asia/Jakarta" }) + " WIB",
      dateDiff
    );

    const pdfFilePath = await generatePDF(htmlResult);

    // const sendemailwithattachment = sendEmail(pdfFilePath);
    // Mengirim email
    const emailResponse = await emailSender(pdfFilePath);

    // const BASE_DIRECTORY = "D:/ProjectME/puppeteer-b2b/document/";

    // const filename = pdfFilePath.replace(BASE_DIRECTORY, "");

    // const sendemail = sendEmail(pdfFilePath);

    // let attachmentData = { filename, pdfFilePath };
    // console.log("attachmentData");
    // console.log(attachmentData);
    // // Stop recording.
    // await recorder.stop();
    await browser.close();
  } catch (err) {
    console.error(err);
    logToFile(`Error: ${err.message}`);
  }

  //   await browser.close();
})();

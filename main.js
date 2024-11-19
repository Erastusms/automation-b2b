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
  waiting,
} = require("./utils");
const { successOrderWithVoucher } = require("./test/scenario-1");
const { getHtmlData, generatePDF } = require("./utils");
const { emailSender } = require("./utils/emailSender");
const moment = require("moment");
const { addCustomCursor, moveCursor } = require("./utils/mouseHelper");
const logdatetime = moment().format("YYYY-MM-DD HH:mm:ss");

// (async () => {
const run = async (env = "DEV") => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    args: ["--start-maximized"],
    // slowMo: 100,
  });

  const page = await browser.newPage();
  const pages = await browser.pages();
  if (pages.length > 1) {
    await pages[0].close();
  }
  let startDate = new Date();

  try {
    // Start recording.
    // const recorder = new PuppeteerScreenRecorder(page);
    // await recorder.start(`./report/video/${new Date().getTime()}.mp4`);
    console.log("this env: " + env);
    let start = performance.now();
    await page.goto(URL.home, { timeout: 0, waitUntil: "networkidle0" });
    let end = performance.now();
    const loadWeb = {
      testCase: "Memuat Halaman B2B",
      duration: await timeCalc(end, start),
    };
    console.log("Memuat Halaman B2B");
    console.log(loadWeb);
    logger.info(
      `================================ AOS TESTING B2B ${logdatetime}  ================================`
    );
    await addCustomCursor(page);

    // await page.mouse.move(box.x, box.y);
    // Contoh penggunaan: pindahkan kursor ke posisi tertentu dan klik
    // await moveAndClick(box.x + box.width / 2, box.y + box.height / 2); // Ganti dengan koordinat yang sesuai
    // Contoh penggunaan: memindahkan kursor ke beberapa posisi
    const element = await page.$(".OtoShop_Register_Link"); // Pilih elemen berdasarkan ID
    const box = await element.boundingBox(); // Ambil posisi dan ukuran elemen
    await moveCursor(page, 0, 0, 100, 200);
    await page.mouse.move(100, 200); // Sesuaikan posisi mouse

    // await animateMouse(page, 0, 0, ".OtoShop_Register_Link")
    // await animateMouse(page, 100, 200, ".OtoShop_Register_Link")

    const endX = box.x + box.width / 2;
    const endY = box.y + box.height / 2;
    await moveCursor(page, 100, 200, endX, endY);
    await page.mouse.move(endX, endY);
    await page.mouse.click(endX, endY);
    await Promise.all([
      // page.evaluate(clickElementByXPath, selectorList.XPathBtnTextLogin),
      logger.info(`Login Button Found & Clicked`),
      page.waitForNavigation(),
    ]);

    // page.on("response", async (response) => {
    //   // console.log(response.url()[0]);
    //   if (response.status() === 200) {
    //     const webURL = response.url();
    //     console.log(`URL: ${webURL}`);
    //   }
    // });

    const loginTest = await loginPage(page, endX, endY);
    // console.log("loginTest");
    // console.log(loginTest);

    // const cartTest = await cartPage(page);
    // console.log("cartTest");
    // console.log(cartTest);

    const homeTest = await homePage(page);
    // console.log("homeTest");
    // console.log(homeTest);

    const searchTest = await searchPage(page);
    // console.log("searchTest");
    // console.log(searchTest);

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

    if (env === "PROD") {
      await emailSender(pdfFilePath);
    }

    // const BASE_DIRECTORY = "D:/ProjectME/puppeteer-b2b/document/";

    // const filename = pdfFilePath.replace(BASE_DIRECTORY, "");

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
};

run();

module.exports = { run };

const {
  selectorList: {
    XPathTotalKoin,
    XPathTotalPoint,
    closeSelectorPoint,
    closeSelectorKoin,
  },
} = require("../constant");
const { clickElementByXPath, waiting, timeCalc, logToFile, logger } = require("../utils");
const moment = require("moment");

const logdatetime = moment().format("YYYY-MM-DD HH:mm:ss");


const clickPoinKoin = async (page, options) => {
  const isTestCaseSuccess = true;

  try {
    let start = performance.now();
    // page.on("request", (request) => {
    //   console.log(request.url());
    // });

    // page.on("response", (response) => {
    //   console.log(response.url());
    // });
    // page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));

    const ops = options.toLowerCase();
    const XPathSelector = ops === "koin" ? XPathTotalKoin : XPathTotalPoint;
    const closeSelector =
      ops === "koin" ? closeSelectorKoin : closeSelectorPoint;

    await page.evaluate(clickElementByXPath, XPathSelector);
    let end = performance.now();

    const clickPoinKoinBtn = {
      testCase: `Click Button ${options}`,
      duration: await timeCalc(end, start),
      isTestCaseSuccess,
    };
    const bodyPoinSelector = "#divSelectPointV2_Step1";
    const bodyKoinSelector = "#LoyaltyPoint_GridBody";
    const opsSelector = ops === "koin" ? bodyKoinSelector : bodyPoinSelector;

    start = performance.now();
    await page.waitForSelector(opsSelector, {
      visible: true,
    });

    const closeBtn = await page.waitForSelector(closeSelector, {
      visible: true,
    });
    // console.log("Clicking the element tombol close... " + options);
    logger.info(`Clicking the element tombol close ${options}`)
    logToFile(`Clicking the element tombol close ${options}`);
    await closeBtn.click();

    end = performance.now();

    const clickCloseBtn = {
      testCase: `Click Button Close`,
      duration: await timeCalc(end, start),
      isTestCaseSuccess,
    };

    await waiting(1000);
    logger.info(`${JSON.stringify([clickPoinKoinBtn, clickCloseBtn])}`);
    return [clickPoinKoinBtn, clickCloseBtn];
    
  } catch (err) {
    console.error(err);
    logger.error(`${JSON.stringify(err.message)}`);
  }
};

module.exports = {
  clickPoinKoin,
};

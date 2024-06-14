const {
  selectorList: {
    XPathTotalKoin,
    XPathTotalPoint,
    closeSelectorPoint,
    closeSelectorKoin,
  },
} = require("../constant");
const { clickElementByXPath, waiting, timeCalc } = require("../utils");

const clickPoinKoin = async (page, options) => {
  const loginResponse = true;

  try {
    let start = performance.now();
    // page.on("request", (request) => {
    //   console.log(request.url());
    // });

    // page.on("response", (response) => {
    //   console.log(response.url());
    // });
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    const ops = options.toLowerCase();
    const XPathSelector = ops === "koin" ? XPathTotalKoin : XPathTotalPoint;
    const closeSelector =
      ops === "koin" ? closeSelectorKoin : closeSelectorPoint;

    await page.evaluate(clickElementByXPath, XPathSelector);
    let end = performance.now();

    const clickPoinKoinBtn = {
      testCase: `Click Button ${options}`,
      duration: await timeCalc(end, start),
      loginResponse,
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
    console.log("Clicking the element tombol close... " + options);
    await closeBtn.click();

    end = performance.now();

    const clickCloseBtn = {
      testCase: `Click Button Close`,
      duration: await timeCalc(end, start),
      loginResponse,
    };

    await waiting(1000);

    return [clickPoinKoinBtn, clickCloseBtn];
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  clickPoinKoin,
};

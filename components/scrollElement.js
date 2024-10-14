const { timeCalc, logToFile,logger } = require("../utils");

module.exports = {
  scrollElement: async (start, page, selectorElement) => {
    let isTestCaseSuccess = true;
    try {
      //logToFile(`Scrolling to the element: ${selectorElement}`)
      logger.info(`Scrolling to the element: ${selectorElement}`)
      // console.log("Scrolling to the element... " + selectorElement);
      await page.evaluate((selector) => {
        document
          .querySelector(selector)
          .scrollIntoView({ behavior: "smooth", block: "end" });
      }, selectorElement);
      let end = performance.now();
      logger.info(`Scroll Element ${selectorElement} Succes`);
      return {
        testCase: "Scroll Element",
        duration: await timeCalc(end, start),
        isTestCaseSuccess,
        
      };
    } catch (err) {
      let end = performance.now();
      let duration = await timeCalc(end, start);
      isTestCaseSuccess = err;
      logger.error(`${err.message }`);
      return {
        response: isTestCaseSuccess,
        duration: duration,
      };
    }
  },
};

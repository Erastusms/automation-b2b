const { timeCalc } = require("../utils");

module.exports = {
  scrollElement: async (start, page, selectorElement) => {
    let isTestCaseSuccess = true;
    try {
      console.log("Scrolling to the element... " + selectorElement);
      await page.evaluate((selector) => {
        document
          .querySelector(selector)
          .scrollIntoView({ behavior: "smooth", block: "end" });
      }, selectorElement);
      let end = performance.now();

      return {
        testCase: "Scroll Element",
        duration: await timeCalc(end, start),
        isTestCaseSuccess,
      };
    } catch (err) {
      let end = performance.now();
      let duration = await timeCalc(end, start);
      isTestCaseSuccess = err;
      return {
        response: isTestCaseSuccess,
        duration: duration,
      };
    }
  },
};

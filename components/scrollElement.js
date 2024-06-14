const { timeCalc } = require("../utils");

module.exports = {
  scrollElement: async (page, selectorElement) => {
    let loginResponse = true;
    let start = performance.now();
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
        loginResponse,
      };
    } catch (err) {
      let end = performance.now();
      let duration = await timeCalc(end, start);
      loginResponse = err;
      return {
        response: loginResponse,
        duration: duration,
      };
    }
  },
};

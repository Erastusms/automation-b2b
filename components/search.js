const {
  selectorList: { searchField, searchWord, searchBtn },
} = require("../constant");
const { timeCalc } = require("../utils");

module.exports = {
  search: async (page) => {
    let start = performance.now();
    let loginResponse = true;

    try {
      await page.type(searchField, searchWord);
      end = performance.now();

      const inputSearchWord = {
        testCase: "Input Search Word",
        duration: await timeCalc(end, start),
        loginResponse,
      };

      start = performance.now();
      const btnSearch = await page.waitForSelector(searchBtn, {
        visible: true,
      });

      await Promise.all([
        btnSearch.click(),
        page.waitForNavigation({ waitUntil: "networkidle2" }),
      ]);
      end = performance.now();

      const clickBtnSearch = {
        testCase: "Click Button Search",
        duration: await timeCalc(end, start),
        loginResponse,
      };

      return [inputSearchWord, clickBtnSearch];
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

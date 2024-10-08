const { URL } = require("../config");
const { selectorList } = require("../constant");
const { timeCalc } = require("../utils");

module.exports = {
  cart: async (page, isHomePage) => {
    const isTestCaseSuccess = true;
    const start = performance.now();

    if (isHomePage) {
      const imgIconCart = await page.waitForSelector(selectorList.cartIcon, {
        visible: true,
      });

      await Promise.all([
        imgIconCart.click(),
        page.waitForNavigation({ waitUntil: "networkidle2" }),
      ]);
    } else {
      await page.goto(URL.cart, { timeout: 0, waitUntil: "networkidle0" });
    }
    const end = performance.now();

    const clickButtonCart = {
      testCase: "Memuat Halaman Cart",
      duration: await timeCalc(end, start),
      isTestCaseSuccess,
    };

    return clickButtonCart;
  },
};

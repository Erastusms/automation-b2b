const { dataLogin, selectorList } = require("./constant");
const { timeCalc } = require("./utils");

module.exports = {
  login: async (page) => {
    let start = performance.now();
    let checkLoginTypeResponse = "";
    let loginResponse = "";

    try {
      // Username
      await page.type(selectorList.inputUsername, dataLogin.username);
      // Password
      await page.type(selectorList.inputPassword, dataLogin.password);

      const clickLogin = await page.waitForSelector(selectorList.btnLogin, {
        visible: true,
      });
      //   await Promise.all([
      //     page.evaluate(() => {
      //       document.getElementById(selectorList.btnLogin).click();
      //     }),
      //     // page.waitForNavigation({ waitUntil: "networkidle0" }),
      //     page.waitForNavigation(),
      //   ]);

      await Promise.all([
        clickLogin.click(),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]);

      let end = performance.now();
      let duration = await timeCalc(end, start);
      console.log("duration");
      console.log(duration);
      return {
        duration,
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

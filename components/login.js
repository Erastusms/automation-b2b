const {
  selectorList: { inputUsername, inputPassword, btnLogin },
} = require("../constant");
const { URL } = require("../config");
const { timeCalc, logToFile } = require("../utils");

module.exports = {
  login: async (page, username, password) => {
    let start = performance.now();
    let isTestCaseSuccess = true;
    const testCaseLogin = [];

    try {
      // console.log("Login case dijalankan...");
      logToFile("Login case dijalankan...");
      // Username
      await page.type(inputUsername, username);
      let end = performance.now();

      const inputUsernameCase = {
        testCase: "Input Username",
        duration: await timeCalc(end, start),
        isTestCaseSuccess,
      };

      // Password
      start = performance.now();
      await page.type(inputPassword, password);
      end = performance.now();

      const inputPasswordCase = {
        testCase: "Input Password",
        duration: await timeCalc(end, start),
        isTestCaseSuccess,
      };

      start = performance.now();
      const clickLogin = await page.waitForSelector(btnLogin, {
        visible: true,
      });

      await Promise.all([
        clickLogin.click(),
        page.waitForNavigation(),
        // page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]);
      end = performance.now();

      const currentUrl = page.url();

      if (currentUrl === URL.home) isTestCaseSuccess = true;
      if (currentUrl === URL.login) {
        const clickUsername = await page.waitForSelector(inputUsername, {
          visible: true,
        });
        await clickUsername.click({ clickCount: 3 });
        await page.keyboard.press("Backspace");
      }

      const btnLoginClick = {
        testCase: "Click Button Login",
        duration: await timeCalc(end, start),
        isTestCaseSuccess,
      };

      testCaseLogin.push(inputUsernameCase, inputPasswordCase, btnLoginClick);
      return testCaseLogin;
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

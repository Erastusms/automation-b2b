const { URL } = require("../config");
const { timeCalc, logToFile } = require("../utils");
const moment = require("moment");

let logdatetime = moment().format('MMMM Do YYYY, h:mm:ss a');

module.exports = {
  login: async (page, options) => {
    const { inputUsername, inputPassword, btnLogin, username, password } =
      options;

    let start = performance.now();
    let isTestCaseSuccess = true;
    const testCaseLogin = [];

    try {
      // Username
      await page.type(inputUsername, username);
      logger.info(` ${logdatetime}|inputUsername selector found & username input successfully`);

      let end = performance.now();

      const inputUsernameCase = {
        testCase: "Input Username",
        duration: await timeCalc(end, start),
        isTestCaseSuccess,
      };

      // Password
      start = performance.now();
      await page.type(inputPassword, password);
      logger.info(`${logdatetime}|inputPassword selector found & password input successfully`);
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
        logger.info(` ${logdatetime}|Login Button Clicked`)
      ]);
      end = performance.now();

      const currentUrl = page.url();

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
      logger.info(`${logdatetime} ${JSON.stringify(testCaseLogin)}`);
      return testCaseLogin;
    } catch (err) {
      let end = performance.now();
      let duration = await timeCalc(end, start);
      isTestCaseSuccess = false;
      logger.error(`${logdatetime} | ${err.message }`);
      return {
        response: isTestCaseSuccess,
        message: err.message,
        duration: duration,
      };
    }
  },
};

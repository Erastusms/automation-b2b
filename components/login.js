const {
  selectorList: { inputUsername, inputPassword, btnLogin },
  URL,
} = require("../constant");
const { timeCalc } = require("../utils");

module.exports = {
  login: async (page, username, password) => {
    let start = performance.now();
    let loginResponse = true;
    const testCaseLogin = [];

    try {
      console.log("Login case dijalankan...");
      // Username
      await page.type(inputUsername, username);
      let end = performance.now();

      const inputUsernameCase = {
        testCase: "Input Username",
        duration: await timeCalc(end, start),
        loginResponse,
      }; 

      // Password
      start = performance.now();
      await page.type(inputPassword, password);
      end = performance.now();

      const inputPasswordCase = {
        testCase: "Input Password",
        duration: await timeCalc(end, start),
        loginResponse,
      };

      start = performance.now();
      const clickLogin = await page.waitForSelector(btnLogin, {
        visible: true,
      });

      await Promise.all([
        clickLogin.click(),
        page.waitForNavigation({ waitUntil: "networkidle2" }),
      ]);
      end = performance.now();

      const currentUrl = page.url();

      if (currentUrl === URL.home) loginResponse = true;
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
        loginResponse,
      };

      testCaseLogin.push(inputUsernameCase, inputPasswordCase, btnLoginClick);
      return testCaseLogin;
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

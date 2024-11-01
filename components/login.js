const { URL } = require("../config");
const { timeCalc, logToFile, logger } = require("../utils");
const moment = require("moment");
const {
  moveCursor,
  addCustomCursor,
  animateMouse,
} = require("../utils/mouseHelper");
const scrollElement = require("./scrollElement");

const logdatetime = moment().format("YYYY-MM-DD HH:mm:ss");

module.exports = {
  login: async (page, options) => {
    await addCustomCursor(page);
    const { inputUsername, inputPassword, btnLogin, username, password } =
      options;

    const { endX, endY } = options;
    let start = performance.now();
    let isTestCaseSuccess = true;
    const testCaseLogin = [];

    try {
      // const element = await page.$(inputUsername); // Pilih elemen berdasarkan ID
      // const box = await element.boundingBox();
      // const boxTargetX = box.x + box.width / 2;
      // const boxTargetY = box.y + box.height / 2;

      // await moveCursor(page, endX, endY, boxTargetX, boxTargetY); // Gerakkan kursor ke posisi kedua
      // await page.mouse.move(boxTargetX, boxTargetY);
      const { targetX: usernameX, targetY: usernameY } = await animateMouse(
        page,
        endX,
        endY,
        inputUsername
      );
      // await page.mouse.click(boxTargetX, boxTargetY);
      // Username
      await page.type(inputUsername, username);
      logger.info(`InputUsername selector found & username input successfully`);

      let end = performance.now();

      const inputUsernameCase = {
        testCase: "Input Username",
        duration: await timeCalc(end, start),
        isTestCaseSuccess,
      };

      // const elementPassword = await page.$(inputPassword); // Pilih elemen berdasarkan ID
      // const boxPassword = await elementPassword.boundingBox();
      // const boxPasswordTargetX = boxPassword.x + boxPassword.width / 2;
      // const boxPasswordTargetY = boxPassword.y + boxPassword.height / 2;

      // await moveCursor(
      //   page,
      //   boxTargetX,
      //   boxTargetY,
      //   boxPasswordTargetX,
      //   boxPasswordTargetY
      // );
      // await page.mouse.move(boxPasswordTargetX, boxPasswordTargetY);
      // await page.mouse.click(boxPasswordTargetX, boxPasswordTargetY);

      const { targetX, targetY } = await animateMouse(
        page,
        usernameX,
        usernameY,
        inputPassword
      );
      start = performance.now();
      await page.type(inputPassword, password);
      logger.info(`InputPassword selector found & password input successfully`);
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

      // const elementLogin = await page.$(btnLogin); // Pilih elemen berdasarkan ID
      // const btnLoginBox = await clickLogin.boundingBox();
      // console.log("btnLoginBox");
      // console.log(btnLoginBox);
      // const btnLoginTargetX = btnLoginBox.x + btnLoginBox.width / 2;
      // const btnLoginTargetY = btnLoginBox.y + btnLoginBox.height / 2;

      // await waiting(1000);
      // await scrollElement(start, page, btnLogin);
      // await moveCursor(
      //   page,
      //   targetX,
      //   targetY,
      //   btnLoginTargetX,
      //   btnLoginTargetY
      // );
      // await waiting(1000);
      // await page.mouse.move(btnLoginTargetX, btnLoginTargetY);
      // await page.mouse.click(btnLoginTargetX, btnLoginTargetY);

      await Promise.all([
        clickLogin.click(),
        page.waitForNavigation(),
        // page.waitForNavigation({ waitUntil: "networkidle0" }),
        logger.info(`Login Button Clicked`),
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
      logger.info(`${JSON.stringify(testCaseLogin)}`);
      return testCaseLogin;
    } catch (err) {
      let end = performance.now();
      let duration = await timeCalc(end, start);
      isTestCaseSuccess = false;
      logger.error(`${err.message}`);
      return {
        response: isTestCaseSuccess,
        message: err.message,
        duration: duration,
      };
    }
  },
};

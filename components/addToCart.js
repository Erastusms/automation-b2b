const {
  selectorList: { btnAddTroliDetail, btnSuccessAddToCart },
} = require("../constant");
const { waiting, timeCalc } = require("../utils");

module.exports = {
  addToCart: async (page, btnAddTroli, btnDetailSKU) => {
    let loginResponse = true;
    let start = performance.now();
    let btnDetail,
      clickBtnAddTroli,
      btnOKAfterAddToCart = "";
    const testing = [];

    try {
      const addToCartSKU = await page.waitForSelector(btnAddTroli, {
        visible: true,
      });

      console.log("Scrolling to the element... " + btnAddTroli);
      await page.evaluate((selector) => {
        document
          .querySelector(selector)
          .scrollIntoView({ behavior: "smooth", block: "center" });
      }, btnAddTroli);

      let end = performance.now();

      const scroll_element = {
        testCase: "Scroll Element To SKU",
        duration: await timeCalc(end, start),
        loginResponse,
      };
      testing.push(scroll_element);

      if (btnDetailSKU) {
        console.log("test add to cart with click detail");
        start = performance.now();
        const detailProduct = await page.waitForSelector(btnDetailSKU, {
          visible: true,
        });

        await detailProduct.click();
        end = performance.now();

        btnDetail = {
          testCase: "Click Detail Product",
          duration: await timeCalc(end, start),
          loginResponse,
        };

        start = performance.now();
        await page.waitForSelector(btnAddTroliDetail, {
          visible: true,
        });

        await page.click(btnAddTroliDetail);
        end = performance.now();

        clickBtnAddTroli = {
          testCase: "Click Button Add To Cart",
          duration: await timeCalc(end, start),
          loginResponse,
        };

        start = performance.now();
        await waiting(1000);
        await page.waitForSelector(btnSuccessAddToCart, {
          visible: true,
        });

        await page.click(btnSuccessAddToCart);
        end = performance.now();

        btnOKAfterAddToCart = {
          testCase: "Click OK In Modal After Add To Cart",
          duration: await timeCalc(end, start),
          loginResponse,
        };
        testing.push(btnDetail, clickBtnAddTroli, btnOKAfterAddToCart);
      } else {
        start = performance.now();
        await addToCartSKU.click();
        await page.waitForSelector(btnSuccessAddToCart, {
          visible: true,
        });
        end = performance.now();

        clickBtnAddTroli = {
          testCase: "Click Button Add To Cart",
          duration: await timeCalc(end, start),
          loginResponse,
        };

        start = performance.now();
        await page.click(btnSuccessAddToCart); // Clicking the button
        end = performance.now();

        btnOKAfterAddToCart = {
          testCase: "Click OK In Modal After Add To Cart",
          duration: await timeCalc(end, start),
          loginResponse,
        };
        testing.push(clickBtnAddTroli, btnOKAfterAddToCart);
      }

      return testing;
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

const {
  selectorList: { btnAddTroliDetail, btnSuccessAddToCart },
} = require("../constant");
const { waiting, timeCalc, logToFile } = require("../utils");
const { scrollElement } = require("./scrollElement");

module.exports = {
  addToCart: async (page, btnAddTroli, btnDetailSKU) => {
    let isTestCaseSuccess = true;
    let start = performance.now();
    let btnDetail,
      clickBtnAddTroli,
      btnOKAfterAddToCart,
      end = "";
    const testing = [];

    try {
      /* Untuk add product sekaligus banyak
      const fetchDetails = await page.evaluate(() => {
        const detailsArray = [];
        const allDetails = document.querySelectorAll(
          ".Item.ItemBox.Widget_Item"
        );
        allDetails.forEach((eachItem) => {
          const itemTitle = eachItem.querySelector("tr>td>b").innerText;
          const itemId = eachItem.querySelector("tr>td>input.ButtonAction").id;
          // const itemPrice = eachItem.querySelector(".price_color").innerText;
          // const imgUrl = eachItem.querySelector("img").src;

          detailsArray.push({
            title: itemTitle,
            btnSelector: itemId,
            // imageURL: imgUrl,
          });
        });
        return detailsArray;
      });
      */

      // const addToCartSKU = await page.waitForSelector(btnAddTroli, {
      //   visible: true,
      // });

      // console.log("Scrolling to the element... " + btnAddTroli);
      // await page.evaluate((selector) => {
      //   document.querySelector(selector).scrollIntoView({ behavior: "smooth" });
      // }, btnAddTroli);

      // let end = performance.now();

      // const scroll_element = {
      //   testCase: "Scroll Element To SKU",
      //   duration: await timeCalc(end, start),
      //   isTestCaseSuccess,
      // };

      // const scroll_element = await scrollElement(start, page, btnAddTroli);
      // testing.push(scroll_element);

      // const skuTroli = [];
      if (btnDetailSKU) {
        logToFile("Klik lihat detail di home page")
        // start = performance.now();
        const detailProduct = await page.waitForSelector(btnDetailSKU, {
          visible: true,
        });

        await detailProduct.click();
        end = performance.now();

        btnDetail = {
          testCase: "Click Detail Product",
          duration: await timeCalc(end, start),
          isTestCaseSuccess,
        };

        start = performance.now();
        const addTroliBtn = await page.waitForSelector(btnAddTroliDetail, {
          visible: true,
        });

        // await page.click(btnAddTroliDetail);
        await addTroliBtn.click();
        end = performance.now();

        clickBtnAddTroli = {
          testCase: "Click Button Add To Cart",
          duration: await timeCalc(end, start),
          isTestCaseSuccess,
        };

        // start = performance.now();
        // await page.waitForSelector(btnSuccessAddToCart, {
        //   visible: true,
        // });
        // await waiting(3000);
        // await page.click(btnSuccessAddToCart);
        // end = performance.now();

        // btnOKAfterAddToCart = {
        //   testCase: "Click OK In Modal After Add To Cart",
        //   duration: await timeCalc(end, start),
        //   isTestCaseSuccess,
        // };
        // testing.push(btnDetail, clickBtnAddTroli, btnOKAfterAddToCart);
        testing.push(btnDetail, clickBtnAddTroli);
      } else {
        // for (let i = 0; i < fetchDetails.length; i++) {
        //   const { btnSelector, title } = fetchDetails[i];

        //   start = performance.now();
        //   const addToCartSKU = await page.waitForSelector(`#${btnSelector}`, {
        //     visible: true,
        //   });
        logToFile("Klik tambah ke troli di home page")
        const addToCartSKU = await page.waitForSelector(btnAddTroli, {
          visible: true,
        });
        const scroll_element = await scrollElement(start, page, btnAddTroli);
        testing.push(scroll_element);

        await addToCartSKU.click();
        end = performance.now();
        clickBtnAddTroli = {
          testCase: "Click Button Add To Cart",
          duration: await timeCalc(end, start),
          isTestCaseSuccess,
        };

        // start = performance.now();
        // await page.waitForSelector(btnSuccessAddToCart, {
        //   visible: true,
        // });
        // await waiting(1000);
        // await page.click(btnSuccessAddToCart);
        // end = performance.now();

        // // skuTroli.push(clickBtnAddTroli);
        // btnOKAfterAddToCart = {
        //   testCase: "Click OK In Modal After Add To Cart",
        //   duration: await timeCalc(end, start),
        //   isTestCaseSuccess,
        // };
        // testing.push(clickBtnAddTroli, btnOKAfterAddToCart);
        testing.push(clickBtnAddTroli);
      }

      await waiting(3000);
      start = performance.now();
      await page.waitForSelector(btnSuccessAddToCart, {
        visible: true,
      });
      await waiting(3000);
      await page.click(btnSuccessAddToCart);
      end = performance.now();

      btnOKAfterAddToCart = {
        testCase: "Click OK In Modal After Add To Cart",
        duration: await timeCalc(end, start),
        isTestCaseSuccess,
      };
      testing.push(btnOKAfterAddToCart);

      return testing;
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

// Scenario ini adalah order CBD yang sukses menggunakan voucher

const { login, clickPoinKoin, addToCart } = require("../components");
const {
  dataLogin: { username, password },
} = require("../config");
const { cartPage } = require("../pages");
const { timeCalc } = require("../utils");

const successOrderWithVoucher = async (page) => {
  try {
    let start = performance.now();
    const testCaseLogin = await login(page, username, password);
    let end = performance.now();

    const loginCase = {
      testCase: "Login",
      duration: await timeCalc(end, start),
      isTestCaseSuccess: true,
    };

    // console.log(testCaseLogin);
    console.log("loginCase");
    console.log(loginCase);

    const testCaseClickPoint = await clickPoinKoin(page, "Point");
    const testCaseClickKoin = await clickPoinKoin(page, "Koin");

    // console.log(testCaseClickPoint);
    // console.log(testCaseClickKoin);
    // const currentURL = page.url();
    // console.log(currentURL);

    const widgetCarousel = "#divWidget45_Carousel";
    await page.waitForSelector(widgetCarousel, { visible: true });

    const ids = await page.evaluate(() => {
      const carouselDiv = document.getElementById("divWidget45_Carousel");

      if (carouselDiv) {
        const elements = carouselDiv.querySelectorAll("*[id]");
        return Array.from(elements)
          .map((el) => el.id)
          .filter((id) => id.includes("btnAddToCart"));
      } else {
        return []; // Return array kosong jika tidak ada elemen dengan ID divWidget45_Carousel
      }
    });

    // Cetak seluruh ID ke console
    console.log("IDs dalam #divWidget45_Carousel:", ids);
    console.log("Jumlah SKU: ", ids.length);

    // const allSKU = [];
    // for (let j = 0; j < 3; j++) {
    //   start = performance.now();
    //   for (let i = 0; i < ids.length; i++) {
    //     await addToCart(page, "#" + ids[i]);
    //   }
    //   end = performance.now();

    //   const addToCartCase = {
    //     testCase: "Add All SKU To Cart Iterasi ke " + (j + 1),
    //     duration: await timeCalc(end, start),
    //     isTestCaseSuccess: true,
    //   };
    //   allSKU.push(addToCartCase);
    // }

    // console.log(testCaseLogin);
    // console.log("allSKU");
    // console.log(allSKU);

    const cartTest = await cartPage(page);
    // console.log("cartTest");
    // console.log(cartTest);
    const succesOrder = {
      testCaseLogin,
      testCaseClickPoint,
      testCaseClickKoin,
      cartTest,
    };
    // console.log("succesOrder");
    // console.log(succesOrder);
    return { succesOrder };
    // const home_add_sku = await addToCart(page, skuRecom);
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  successOrderWithVoucher,
};

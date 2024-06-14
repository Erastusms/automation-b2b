const { scrollElement } = require("../components");
const {
  selectorList: { cartIcon, cartAddItem, cartUseVoucher },
} = require("../constant");
const { waiting, timeCalc } = require("../utils");

const cartPage = async (page) => {
  const loginResponse = true;
  const cart_page = [];
  let start = performance.now();
  try {
    const imgIconCart = await page.waitForSelector(cartIcon, {
      visible: true,
    });

    await Promise.all([
      imgIconCart.click(),
      page.waitForNavigation({ waitUntil: "networkidle2" }),
    ]);
    let end = performance.now();

    const clickButtonCart = {
      testCase: "Click Button Cart",
      duration: await timeCalc(end, start),
      loginResponse,
    };

    // pada halaman cart
    start = performance.now();
    await page.type("#txtPartNumber", "GSMF-GTZ-4V");
    await page.type("#txtQuantity", "5");

    const btnAddItem = await page.waitForSelector(cartAddItem, {
      visible: true,
    });

    await btnAddItem.click();
    await waiting(1000);
    end = performance.now();

    const clickAddItemCart = {
      testCase: "Add Item in Cart",
      duration: await timeCalc(end, start),
      loginResponse,
    };
    // await page.type("#txtPartNumber", "GSMF-GTZ-8V");
    // await page.type("#txtQuantity", "5");

    // await btnAddItem.click();

    console.log("Waiting for selector...");
    const btnSelectVoucher = await page.waitForSelector("#btnSelectVoucher", {
      visible: true,
    });

    const scrollBtnLihatVoucher = await scrollElement(page, btnSelectVoucher);

    await waiting(1000);
    await btnSelectVoucher.click();

    const cartUseVoucher1 = await page.waitForSelector(cartUseVoucher, {
      visible: true,
    });

    const scrollSelector = await scrollElement(page, cartUseVoucher);
    await waiting(1000);

    await cartUseVoucher1.click();
    await waiting(1000);

    console.log("Waiting for selector...");
    //   const selector = 'input.ButtonAction[value="Ok"]';
    await page.waitForSelector("#ucModal1_ButtonText", {
      visible: true,
    }); // Waiting for the button to be visible

    console.log("Clicking the element OK...");
    await page.click("#ucModal1_ButtonText"); // Clicking the button'

    console.log("Waiting for selector...");
    //   const selector = 'input.ButtonAction[value="Ok"]';
    const selector23 = 'a.fancybox-item.fancybox-close[title="Close"]';
    const tombolClose = await page.waitForSelector(selector23, {
      visible: true,
    });

    await waiting(1000);

    console.log("Clicking the element tombol close...");
    await tombolClose.click();

    cart_page.push(clickButtonCart, clickAddItemCart);
    return { cart_page };
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  cartPage,
};

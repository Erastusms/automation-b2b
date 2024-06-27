const { scrollElement } = require("../components");
const {
  selectorList: { cartIcon, cartAddItem, cartUseVoucher, cartSelectVoucher },
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

    cart_page.push(clickButtonCart, clickAddItemCart);
    console.log("Waiting for selector...");
    start = performance.now();
    const btnSelectVoucher = await page.waitForSelector(cartSelectVoucher, {
      visible: true,
    });

    const scrollBtnLihatVoucher = await scrollElement(
      start,
      page,
      cartSelectVoucher
    );
    console.log("scrollBtnLihatVoucher");
    console.log(scrollBtnLihatVoucher);
    cart_page.push(scrollBtnLihatVoucher);

    await waiting(1000);

    start = performance.now();
    await btnSelectVoucher.click();
    await waiting(1000);
    end = performance.now();

    const clickBtnSelectVoucher = {
      testCase: "Click Button Select Voucher",
      duration: await timeCalc(end, start),
      loginResponse,
    };
    cart_page.push(clickBtnSelectVoucher);

    start = performance.now();
    const cartUseVoucher1 = await page.waitForSelector(cartUseVoucher, {
      visible: true,
    });

    const scrollSelector = await scrollElement(start, page, cartUseVoucher);
    cart_page.push(scrollSelector);

    await waiting(1000);

    start = performance.now();
    await cartUseVoucher1.click();
    await waiting(1000);
    end = performance.now();

    const clickUseVoucher1 = {
      testCase: "Click Use Voucher",
      duration: await timeCalc(end, start),
      loginResponse,
    };
    cart_page.push(clickUseVoucher1);

    console.log("Waiting for selector...");
    start = performance.now();
    await page.waitForSelector("#ucModal1_ButtonText", {
      visible: true,
    }); // Waiting for the button to be visible

    console.log("Clicking the element OK...");
    await page.click("#ucModal1_ButtonText"); // Clicking the button'
    end = performance.now();

    const clickButtonOK = {
      testCase: "Click OK After Use Voucher",
      duration: await timeCalc(end, start),
      loginResponse,
    };
    cart_page.push(clickButtonOK);

    console.log("Waiting for selector...");
    start = performance.now();
    const selector23 = 'a.fancybox-item.fancybox-close[title="Close"]';
    const tombolClose = await page.waitForSelector(selector23, {
      visible: true,
    });

    await waiting(1000);
    await tombolClose.click();
    end = performance.now();

    const clickCloseBtn = {
      testCase: `Click Button Close`,
      duration: await timeCalc(end, start),
      loginResponse,
    };
    cart_page.push(clickCloseBtn);

    return { cart_page };
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  cartPage,
};
